import { Injectable, NotAcceptableException, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { plainToClass, plainToInstance } from 'class-transformer'
import { DeleteResult, Repository, UpdateResult } from 'typeorm'
import { CategoryService } from '../category/category.service'
import { DeveloperService } from '../developer/developer.service'
import { ParsingStatus } from '../pdalife-parser/pdalife-parser.interfaces'
import { ScreenshotService } from '../screenshot/screenshot.service'
import { TagService } from '../tag/tag.service'
import { ApplicationEntity } from './application.entity'
import { CreateApplicationDto, UpdateApplicationDto } from './dto'

@Injectable()
export class ApplicationService {
  constructor(
    @InjectRepository(ApplicationEntity) private readonly applicationRepository: Repository<ApplicationEntity>,
    private readonly categoryService: CategoryService,
    private readonly tagService: TagService,
    private readonly developerService: DeveloperService,
    private readonly screenshotService: ScreenshotService
  ) {}

  public findAll(): Promise<ApplicationEntity[]> {
    return this.applicationRepository.find({
      relations: ['categories', 'screenshots', 'developer', 'tags', 'applicationVersions', 'applicationVersions.files'],
    })
  }

  public async findOne(id: number): Promise<ApplicationEntity> {
    const application = await this.applicationRepository.findOneBy({ id })

    if (!application) {
      throw new NotAcceptableException('Application not found')
    }

    return application
  }

  public async findUncompleted(take: number = 10): Promise<ApplicationEntity[]> {
    return this.applicationRepository.find({
      where: { parsingStatus: ParsingStatus.UNCOMPLETED },
      relations: ['screenshots'],
      take,
    })
  }

  public async create(dto: CreateApplicationDto): Promise<ApplicationEntity> {
    const application = this.applicationRepository.create(dto)
    const categories = await this.categoryService.findByIds(dto.categoryIds)

    application.categories = categories

    return this.applicationRepository.save(application)
  }

  public async save(application: ApplicationEntity) {
    return await this.applicationRepository.save(application)
  }

  public async update(id: number, dto: UpdateApplicationDto): Promise<ApplicationEntity> {
    const { categoryIds, tagIds, screenshotIds, developerId, ...restDto } = dto

    const application = await this.applicationRepository.findOneBy({ id })

    if (!application) {
      throw new NotFoundException('Application not found')
    }

    if (categoryIds) {
      const categories = await this.categoryService.findByIds(categoryIds)
      application.categories = categories
    }

    if (tagIds) {
      const tags = await this.tagService.findByIds(tagIds)
      application.tags = tags
    }

    if (screenshotIds) {
      const screenshots = await this.screenshotService.findByIds(screenshotIds)
      application.screenshots = screenshots
    }

    if (developerId) {
      const developer = await this.developerService.findOne(developerId)
      application.developer = developer
    }

    return await this.applicationRepository.save(plainToInstance(ApplicationEntity, { ...application, ...restDto }))
  }

  public async delete(id: number): Promise<DeleteResult> {
    const application = await this.applicationRepository.findOneBy({ id })

    if (!application) {
      throw new NotFoundException('Application not found')
    }

    return this.applicationRepository.delete(id)
  }
}
