import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { DeleteResult, Like, Repository, UpdateResult } from 'typeorm'
import { Developer } from './developer.entity'
import { CreateDeveloperDto, SearchDeveloperDto, UpdateDeveloperDto } from './dto'

@Injectable()
export class DeveloperService {
  constructor(@InjectRepository(Developer) private readonly developerRepository: Repository<Developer>) {}

  public async search(dto: SearchDeveloperDto) {
    let { limit, page, order, orderBy, search } = dto

    limit = limit || 10
    limit > 100 ? 100 : limit

    page = page || 1
    page < 1 ? 1 : page

    const skip = (page - 1) * limit

    orderBy = orderBy || 'id'
    order = order || 'DESC'

    let where = {}
    if (search && Object.keys(search).length) {
      where = Object.keys(search).reduce((acc, item) => {
        if (item === 'id' && String(dto.search[item]) !== '') {
          if (String(dto.search[item]) !== '') {
            return { ...acc, [item]: Number(dto.search[item]) }
          }
          return { ...acc }
        }
        return { ...acc, [item]: Like('%' + dto.search[item] + '%') }
      }, {})
    }

    const [result, total] = await this.developerRepository.findAndCount({
      where,
      order: { [orderBy]: order.toLocaleUpperCase() },
      take: limit,
      skip,
    })

    return { items: result, total, page: Number(page), limit }
  }

  public findAll(): Promise<Developer[]> {
    return this.developerRepository.find()
  }

  public async findOne(id: number): Promise<Developer> {
    const developer = await this.developerRepository.findOneBy({ id })

    if (!developer) {
      throw new NotFoundException('Developer not found')
    }

    return developer
  }

  public findByName(name: string): Promise<Developer> {
    return this.developerRepository.findOneBy({ name })
  }

  public async create(dto: CreateDeveloperDto): Promise<Developer> {
    const { name } = dto
    const developer = await this.findByName(name)

    if (developer) {
      return developer
    }

    return this.developerRepository.save(dto)
  }

  public update(id: number, dto: UpdateDeveloperDto): Promise<UpdateResult> {
    return this.developerRepository.update(id, dto)
  }

  public async delete(id: number): Promise<DeleteResult> {
    const developer = await this.developerRepository.findOneBy({ id })

    if (!developer) {
      throw new NotFoundException('Developer not found')
    }

    return this.developerRepository.delete(developer)
  }
}
