import { Injectable, NotAcceptableException, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { plainToInstance } from 'class-transformer'
import { OrderDirection } from 'src/types'
import { isNumeric } from 'src/utils'
import { DeleteResult, Repository } from 'typeorm'
import { CategoryService } from '../category/category.service'
import { DeveloperService } from '../developer/developer.service'
import { ParsingStatus } from '../pdalife-parser/pdalife-parser.interfaces'
import { ScreenshotService } from '../screenshot/screenshot.service'
import { TagService } from '../tag/tag.service'
import { ApplicationEntity } from './application.entity'
import { CreateApplicationDto, SearchApplicationDto, UpdateApplicationDto } from './dto'

@Injectable()
export class ApplicationService {
  constructor(
    @InjectRepository(ApplicationEntity) private readonly applicationRepository: Repository<ApplicationEntity>,
    private readonly tagService: TagService,
    private readonly categoryService: CategoryService,
    private readonly developerService: DeveloperService,
    private readonly screenshotService: ScreenshotService
  ) {}

  public async search(dto: SearchApplicationDto) {
    let { limit, page, order, orderBy, search } = dto

    orderBy = orderBy || 'id'
    order = (order || 'desc').toUpperCase()

    limit = limit || 10
    limit > 100 ? 100 : limit

    page = page || 1
    page < 1 ? 1 : page

    const offset = (page - 1) * limit

    const queryBuilder = this.applicationRepository.createQueryBuilder('application')

    queryBuilder.leftJoinAndSelect('application.developer', 'developer')

    queryBuilder.orderBy(`application.${orderBy}`, order as OrderDirection)
    queryBuilder.offset(offset)
    queryBuilder.limit(limit)

    console.log(search)

    if (search) {
      Object.keys(search).forEach((key) => {
        if (isNumeric(search[key])) {
          queryBuilder.andWhere(`application.${key} = :${key}`, { [key]: search[key] })
          return
        }
        queryBuilder.andWhere(`application.${key} ILIKE :${key}`, { [key]: `%${search[key]}%` })
      })
    }

    const [items, total] = await queryBuilder.getManyAndCount()

    return { items, total, page, limit }
  }

  public findAll(): Promise<ApplicationEntity[]> {
    return this.applicationRepository.find({
      relations: ['categories', 'screenshots', 'developer', 'tags', 'applicationVersions', 'applicationVersions.files'],
    })
  }

  public async findOne(id: number): Promise<ApplicationEntity> {
    const application = await this.applicationRepository.findOne({
      where: { id },
      relations: ['categories', 'screenshots', 'developer', 'tags', 'applicationVersions', 'applicationVersions.files'],
    })

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
