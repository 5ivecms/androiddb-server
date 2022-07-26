import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { DeleteResult, In, Repository, UpdateResult } from 'typeorm'
import { CreateTagDto, UpdateTagDto } from './dto'
import { Tag } from './tag.entity'

@Injectable()
export class TagService {
  constructor(@InjectRepository(Tag) private readonly tagRepository: Repository<Tag>) {}

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
