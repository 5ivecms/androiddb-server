import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { OrderDirection } from 'src/types'
import { isNumeric } from 'src/utils'
import { DeleteResult, In, Repository, UpdateResult } from 'typeorm'
import { CreateTagDto, SearchTagDto, UpdateTagDto } from './dto'
import { Tag } from './tag.entity'

@Injectable()
export class TagService {
  constructor(@InjectRepository(Tag) private readonly tagRepository: Repository<Tag>) {}

  public async search(dto: SearchTagDto) {
    let { limit, page, order, orderBy, search } = dto

    orderBy = orderBy || 'id'
    order = (order || 'desc').toUpperCase()

    limit = limit || 10
    limit > 100 ? 100 : limit

    page = page || 1
    page < 1 ? 1 : page

    const offset = (page - 1) * limit

    const queryBuilder = this.tagRepository.createQueryBuilder('tag')

    queryBuilder.loadRelationCountAndMap('tag.applicationCount', 'tag.applications')
    queryBuilder.orderBy(orderBy, order as OrderDirection)
    queryBuilder.offset(offset)
    queryBuilder.limit(limit)

    if (search) {
      Object.keys(search).forEach((key) => {
        if (isNumeric(search[key])) {
          queryBuilder.andWhere(`tag.${key} = :${key}`, { [key]: search[key] })
          return
        }
        queryBuilder.andWhere(`tag.${key} like :${key}`, { [key]: `%${search[key]}%` })
      })
    }

    const [items, total] = await queryBuilder.getManyAndCount()

    return { items, total, page, limit }
  }

  public findAll(): Promise<Tag[]> {
    return this.tagRepository.find()
  }

  public findOne(id: number): Promise<Tag> {
    return this.tagRepository.findOneBy({ id })
  }

  public async findByTitle(title: string): Promise<Tag | null> {
    const tag = await this.tagRepository.findOneBy({ title })

    if (!tag) {
      return null
    }

    return tag
  }

  public findByIds(ids: number[]) {
    return this.tagRepository.findBy({ id: In(ids) })
  }

  public async create(dto: CreateTagDto): Promise<Tag> {
    const tag = await this.findByTitle(dto.title)

    if (tag) {
      return tag
    }

    return this.tagRepository.save(dto)
  }

  public async createMany(dto: CreateTagDto[]): Promise<Tag[]> {
    return await Promise.all(dto.map(async (dto) => await this.create(dto)))
  }

  public async update(id: number, dto: UpdateTagDto): Promise<UpdateResult> {
    const tag = await this.tagRepository.findOneBy({ id })

    if (!tag) {
      throw new NotFoundException('Tag not found')
    }

    return this.tagRepository.update(id, dto)
  }

  public remove(id: number): Promise<DeleteResult> {
    return this.tagRepository.delete(id)
  }
}
