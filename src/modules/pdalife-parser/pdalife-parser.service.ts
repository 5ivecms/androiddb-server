import { BadRequestException, Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { path } from 'app-root-path'
import axios from 'axios'
import * as cheerio from 'cheerio'
import { ensureDir, writeFile } from 'fs-extra'
import { ApplicationVersionService } from '../application-version/application-version.service'
import { ApplicationEntity } from '../application/application.entity'
import { ApplicationService } from '../application/application.service'
import { CategoryEntity } from '../category/category.entity'
import { CategoryService } from '../category/category.service'
import { DeveloperService } from '../developer/developer.service'
import { FileService } from '../file/file.service'
import { FileEnum } from '../file/file.types'
import { Screenshot } from '../screenshot/entities/screenshot.entity'
import { ScreenshotService } from '../screenshot/screenshot.service'
import { TagService } from '../tag/tag.service'
import { ApplicationPage } from './pages'
import { pdalifeAxios } from './pdalife-parser.axios'
import { ParsingStatus, PDALifeApp } from './pdalife-parser.interfaces'
import { getGameCatalogUrl, PDALIFE_BASE_URL } from './pdalife-parser.routes'
import { getAndroidVersion, getRequirementValue } from './pdalife-parser.utils'
import { initBrowser } from './webdriver'

@Injectable()
export class PDALifeParserService {
  constructor(
    private readonly tagService: TagService,
    private readonly fileService: FileService,
    private readonly configService: ConfigService,
    private readonly categoryService: CategoryService,
    private readonly developerService: DeveloperService,
    private readonly screenshotService: ScreenshotService,
    private readonly applicationService: ApplicationService,
    private readonly applicationVersionService: ApplicationVersionService
  ) {}

  public async parseCatalog(): Promise<ApplicationEntity[]> {
    let startPage = 1
    for (let page = startPage; page < 10000; page++) {
      try {
        const { data } = await pdalifeAxios.get<string>(getGameCatalogUrl(page))
        const apps = this.getAppsFromHtml(data)
        if (!apps.length) {
          return []
        }

        const result = await Promise.all(
          apps.map(async (app) => {
            const { title, shortDescription, poster, url } = app
            return await this.applicationService.create({
              title,
              description: '',
              shortDescription,
              thumb: poster,
              pdalifeUrl: url,
              parsingStatus: ParsingStatus.UNCOMPLETED,
            })
          })
        )
        return result
      } catch {
        throw new BadRequestException('Ошибка парсинга')
      }
    }
  }

  public async parseFullApp() {
    const applications = await this.applicationService.findUncompleted(1)
    if (!applications.length) {
      console.log('Приложений нет')
      return
    }
    const application = applications[0]

    const browser = await initBrowser()
    const applicationPage = new ApplicationPage(browser)
    await applicationPage.openPage(`${PDALIFE_BASE_URL}${application.pdalifeUrl}`)
    //await applicationPage.openPage(`https://pdalife.to/fortnite-android-a33605.html`)

    const description = await applicationPage.getDescription()
    const googlePlayUrl = await applicationPage.getGooglePlayUrl()
    const lang = await applicationPage.getApplicationParam('Язык')

    const screenshotUrls = await applicationPage.getScreenshots()
    const screenshots = await this.saveScreenshots(screenshotUrls, application.id)

    const categoryName = await applicationPage.getApplicationParam('Категория')
    const category = await this.categoryService.findByTitle(categoryName)
    const categories = await this.categoryService.findAncestorsTree(category)

    const tagNames = await applicationPage.getTags()
    const tags = await this.tagService.createMany(tagNames.map((tagName) => ({ title: tagName })))

    let developer = null
    const developerUrl = await applicationPage.getDeveloperUrl()
    if (developerUrl) {
      await applicationPage.newWindow(`${PDALIFE_BASE_URL}${developerUrl}`)
      const developerName = await applicationPage.getDeveloperName()
      await applicationPage.closeWindow()
      developer = await this.developerService.create({ name: developerName })
    }

    await this.applicationService.update(application.id, {
      description,
      googlePlayUrl,
      lang,
      developerId: developer?.id,
      tagIds: tags.map((tag) => tag.id),
      categoryIds: categories.map((category) => category.id),
      screenshotIds: screenshots.map((screenshot) => screenshot.id),
      parsingStatus: ParsingStatus.COMPLETED,
    })

    const androidVersion = getAndroidVersion(await applicationPage.getRequirement('Версия ОС'))
    const internet = getRequirementValue(await applicationPage.getRequirement('Интернет'))
    const multiplayer = getRequirementValue(await applicationPage.getRequirement('Мультиплеер'))
    const diskSpace = getRequirementValue(await applicationPage.getRequirement('Требуется свободного места'))

    await applicationPage.loadMoreGames()
    const appVersions = await applicationPage.getAppVersions()

    await Promise.all(
      appVersions.map(async (appVersion) => {
        const { changes, description, version } = appVersion

        const fileEntities = await Promise.all(
          appVersion.files.map(async (file) => {
            const { mod, size, label } = file
            return await this.fileService.create({ mod, size, path: null, type: this.getFileType(label) })
          })
        )

        const fileIds = fileEntities.map((fileEntity) => fileEntity.id)

        return await this.applicationVersionService.create({
          applicationId: application.id,
          changes,
          description,
          version,
          fileIds,
          androidVersion,
          internet,
          multiplayer,
          diskSpace,
        })
      })
    )

    console.log('закончили')
    await browser.closeWindow()

    return true
  }

  public async parseCategories(parentCategoryUrl: string, parentCategoryTitle: string): Promise<CategoryEntity[]> {
    try {
      const parentCategoryEntity = await this.categoryService.create({ title: parentCategoryTitle })
      const { data } = await pdalifeAxios.get<string>(parentCategoryUrl)
      const $ = cheerio.load(data)

      const categories: string[] = []
      $('.catalog-tags__button').map((_, elem) => categories.push($(elem).text().trim()))

      return await Promise.all(
        categories.map(
          async (category) => await this.categoryService.create({ title: category, parentId: parentCategoryEntity.id })
        )
      )
    } catch {
      throw new BadRequestException('Ошибка парсинга')
    }
  }

  private getAppsFromHtml(html: string): PDALifeApp[] {
    const pdalifeApps: PDALifeApp[] = []

    const $ = cheerio.load(html)

    const catalogItems = $('.catalog-list .catalog-item')
    if (!catalogItems.length) {
      return pdalifeApps
    }

    catalogItems.each((_, item) => {
      const posterEl = $(item).find('.catalog-item__poster img')
      const itemTitleEl = $(item).find('.catalog-item__title')

      const poster = $(posterEl).attr('src').trim()
      const title = $(itemTitleEl).find('a').text().trim()
      const url = $(itemTitleEl).find('a').attr('href').trim()
      const shortDescription = $(item).find('.catalog-item__description').text().trim()
      const category = $(item).find('.catalog-item__genre-button').text().trim()

      const pdalifeApp: PDALifeApp = {
        poster,
        title,
        shortDescription,
        category,
        url,
      }

      pdalifeApps.push(pdalifeApp)
    })

    return pdalifeApps
  }

  private async saveScreenshots(screenshots: string[], applicationId: number): Promise<Screenshot[]> {
    const screenshotsFolder = this.configService.get<string>('storage.screenshotsFolder')
    await ensureDir(`${path}${screenshotsFolder}/${applicationId}`)

    return await Promise.all(
      screenshots.map(async (screenshot, index) => {
        const fileContent = await axios.get<Buffer>(screenshot, { responseType: 'arraybuffer' })
        const screenshotPath = `${screenshotsFolder}/${applicationId}/img${index}.jpg`
        const screenshotFullPath = `${path}${screenshotPath}`

        await writeFile(screenshotFullPath, fileContent.data)

        return await this.screenshotService.create({ url: screenshotPath })
      })
    )
  }

  private getFileType(label: string) {
    if (label.toLowerCase().indexOf('Скачать КЭШ'.toLowerCase()) !== -1) {
      return FileEnum.CACHE
    }

    return FileEnum.APK
  }
}
