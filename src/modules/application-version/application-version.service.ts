import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { DeleteResult, In, Repository, UpdateResult } from 'typeorm'
import { FileService } from '../file/file.service'
import { ApplicationVersion } from './application-version.entity'
import { CreateApplicationVersionDto, UpdateApplicationVersionDto } from './dto'

@Injectable()
export class ApplicationVersionService {
  constructor(
    @InjectRepository(ApplicationVersion) private readonly applicationVersionRepository: Repository<ApplicationVersion>,
    private readonly fileService: FileService
  ) {}

  public findAll(): Promise<ApplicationVersion[]> {
    return this.applicationVersionRepository.find()
  }

  public findOne(id: number): Promise<ApplicationVersion | null> {
    return this.applicationVersionRepository.findOneBy({ id })
  }

  public async create(dto: CreateApplicationVersionDto): Promise<ApplicationVersion> {
    const { applicationId, version, fileIds } = dto
    const applicationVersion = await this.applicationVersionRepository.findOneBy({ applicationId, version })

    if (applicationVersion) {
      return applicationVersion
    }

    const entity = this.applicationVersionRepository.create(dto)

    if (fileIds) {
      const files = await this.fileService.findAll({ where: { id: In(fileIds) } })
      entity.files = files
    }

    return this.applicationVersionRepository.save(entity)
  }

  public async createMany(dto: CreateApplicationVersionDto[]) {
    return await Promise.all(dto.map(async (dtoItem) => await this.create(dtoItem)))
  }

  public update(id: number, dto: UpdateApplicationVersionDto): Promise<UpdateResult> {
    return this.applicationVersionRepository.update(id, dto)
  }

  public delete(id: number): Promise<DeleteResult> {
    return this.applicationVersionRepository.delete(id)
  }
}
