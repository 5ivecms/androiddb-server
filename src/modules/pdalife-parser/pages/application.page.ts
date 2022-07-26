import { sleep } from 'src/utils'
import { ChainablePromiseElement } from 'webdriverio'
import { PDALifeAppVersion, PDALifeFile } from '../pdalife-parser.interfaces'
import { BasePage } from './base.page'

export class ApplicationPage extends BasePage {
  async openPage(url: string): Promise<void> {
    await super.open(url)
  }

  async getSliderNextButton(): Promise<ChainablePromiseElement<WebdriverIO.Element> | null> {
    try {
      await this.browser.$('.fotorama .fotorama__arr--next').waitForExist({ timeout: 5000, reverse: false })
      return await this.browser.$('.fotorama .fotorama__arr--next')
    } catch {
      return null
    }
  }

  async isNextButtonDisabled(): Promise<boolean | null> {
    const nextButton = await this.getSliderNextButton()
    if (!nextButton) {
      return null
    }

    const nextButtonClass = await nextButton.getAttribute('class')
    if (nextButtonClass.indexOf('fotorama__arr--disabled') !== -1) {
      return true
    }

    return false
  }

  async nextScreenshot() {
    const nextButton = await this.getSliderNextButton()
    if (!nextButton) {
      return false
    }

    await nextButton.click()
  }

  async countScreenshots(): Promise<number> {
    try {
      await this.browser
        .$('.fotorama__nav__frame.fotorama__nav__frame--thumb')
        .waitForExist({ timeout: 5000, reverse: false })
      const screenshotsThumbs = await this.browser.$$('.fotorama__nav__frame.fotorama__nav__frame--thumb')
      return screenshotsThumbs.length
    } catch {
      return 0
    }
  }

  async getScreenshotSrc(): Promise<string> {
    await this.browser.$('.fotorama__wrap').waitForExist({ timeout: 5000, reverse: false })
    await this.browser.$('.fotorama__active').waitForExist({ timeout: 5000, reverse: false })

    try {
      const videoPlay = await this.browser.$('.fotorama__active .fotorama__video-play').isExisting()
      if (videoPlay) {
        return ''
      }

      const screenshotImg = await this.browser.$('.fotorama__active .fotorama__img')
      const screenshotSrc = screenshotImg.getAttribute('src')
      return screenshotSrc
    } catch {
      return ''
    }
  }

  async getScreenshots(): Promise<string[]> {
    const screenshots = []
    const countScreenshots = await this.countScreenshots()
    for (let i = 1; i <= countScreenshots; i++) {
      const screenshotSrc = await this.getScreenshotSrc()
      if (screenshotSrc.length !== 0) {
        screenshots.push(screenshotSrc)
      }

      const nextButton = await this.getSliderNextButton()
      const nextButtonClass = await nextButton.getAttribute('class')
      if (nextButtonClass.indexOf('fotorama__arr--disabled') !== -1) {
        break
      }

      await this.nextScreenshot()
      await sleep(1000)
    }

    return screenshots
  }

  async getApplicationParam(param: string): Promise<string> {
    await this.browser.$('.game-short__list').waitForExist({ timeout: 5000, reverse: false })
    const shortListItems = await this.browser.$$('.game-short__item')
    let paramValue = ''
    for (const item of shortListItems) {
      const itemLabelText = (await item.$('.game-short__label-text').getText()).trim()
      if (itemLabelText === param) {
        paramValue = (await item.$('.game-short__control').getText()).trim()
      }
    }
    return paramValue
  }

  async getDescription() {
    try {
      await this.browser.$('.game__description.text').waitForExist({ timeout: 5000, reverse: false })
      return await this.browser.$('.game__description.text').getHTML()
    } catch {
      return ''
    }
  }

  async getRequirement(requirement: string): Promise<string> {
    await this.browser.$('.game-download').waitForExist({ timeout: 5000, reverse: false })
    await this.browser.$('.game-download__list').waitForExist({ timeout: 5000, reverse: false })
    const items = await this.browser.$$('.game-download__list li')
    for (const item of items) {
      const text = await item.getText()
      if (text.indexOf(requirement) !== -1) {
        return text
      }
    }
    return ''
  }

  async getLoadMoreGamesButton(): Promise<ChainablePromiseElement<WebdriverIO.Element> | null> {
    try {
      await this.browser.$('.game-versions__load-more').waitForExist({ timeout: 5000, reverse: false })
      return await this.browser.$('.game-versions__load-more')
    } catch {
      return null
    }
  }

  async loadMoreGames(): Promise<void> {
    const button = await this.getLoadMoreGamesButton()
    if (!button) {
      return
    }

    const isClickable = await button.isClickable()
    if (!isClickable) {
      return
    }

    await button.click()
    await sleep(500)
    await this.loadMoreGames()
  }

  async getAppVersions(): Promise<PDALifeAppVersion[]> {
    const appVersions: PDALifeAppVersion[] = []
    const appVersionsEls = await this.browser.$$('.game-versions .accordion-item')
    for (const item of appVersionsEls) {
      const version = await item.$('.accordion-title span strong').getText()
      //const title = await item.$$('.accordion-title span')[0].getText()
      const changes = await item.$('.accordion-inner.js-changes-wrapper.js-more-lines').getHTML()
      let description = ''
      try {
        description = await item.$('.accordion-text__selection_dark .accordion-inner').getHTML()
      } catch {}

      const files: PDALifeFile[] = []
      const downloadList = await item.$$('.game-versions__downloads-list li')
      for (const downloadItem of downloadList) {
        let fileMod = ''
        try {
          fileMod = await downloadItem.$('.game-versions__downloads-mod').getText()
        } catch {}
        const fileLabel = await downloadItem.$('.game-versions__downloads-label').getText()
        const fileSize = await downloadItem.$('.game-versions__downloads-size').getText()
        files.push({ mod: fileMod, label: fileLabel, size: fileSize })
      }

      appVersions.push({
        //title,
        description,
        changes,
        version,
        files,
      })
    }

    return appVersions
  }

  async getTags(): Promise<string[]> {
    await this.browser.$('.main-bottom .main-row').waitForExist({ timeout: 5000, reverse: false })
    const tagEls = await this.browser.$$('.game-tag')
    const tags = []
    for (const tagEl of tagEls) {
      const tagTitle = (await tagEl.getText()).trim()
      tags.push(tagTitle.slice(1, tagTitle.length))
    }

    return tags
  }

  async getGooglePlayUrl(): Promise<string> {
    try {
      await this.browser.$('.game-download__stores .store-button').waitForExist({ timeout: 5000, reverse: false })
      return (await this.browser.$('.game-download__stores .store-button').getAttribute('href')).trim()
    } catch {
      return ''
    }
  }

  async getDeveloperUrl() {
    await this.browser.$('.game-short__list').waitForExist({ timeout: 5000, reverse: false })
    const shortListItems = await this.browser.$$('.game-short__item')
    let url = ''
    for (const item of shortListItems) {
      const itemLabelText = (await item.$('.game-short__label-text').getText()).trim()
      if (itemLabelText === 'Разработчик') {
        url = (await item.$('.game-short__control a').getAttribute('href')).trim()
        break
      }
    }
    return url
  }

  async getDeveloperName(): Promise<string> {
    try {
      await this.browser
        .$('.compilation-banner__title .compilation-banner__title-first')
        .waitForExist({ timeout: 5000, reverse: false })
    } catch {
      return ''
    }
    return (await this.browser.$('.compilation-banner__title .compilation-banner__title-first').getText()).trim()
  }
}
