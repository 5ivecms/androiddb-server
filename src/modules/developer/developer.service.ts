import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { DeleteResult, Repository, UpdateResult } from 'typeorm'
import { Developer } from './developer.entity'
import { CreateDeveloperDto, UpdateDeveloperDto } from './dto'

@Injectable()
export class DeveloperService {
  constructor(@InjectRepository(Developer) private readonly developerRepository: Repository<Developer>) {}

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
