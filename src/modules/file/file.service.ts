import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { FindManyOptions, Repository } from 'typeorm'
import { CreateFileDto, UpdateFileDto } from './dto'
import { FileEntity } from './file.entity'

@Injectable()
export class FileService {
  constructor(@InjectRepository(FileEntity) private readonly fileService: Repository<FileEntity>) {}

  public findAll(options?: FindManyOptions<FileEntity>): Promise<FileEntity[]> {
    return this.fileService.find(options)
  }

  public findOne(id: number) {
    return this.fileService.findOneBy({ id })
  }

  public create(dto: CreateFileDto): Promise<FileEntity> {
    return this.fileService.save(dto)
  }

  public update(id: number, dto: UpdateFileDto) {
    return this.fileService.update(id, dto)
  }

  public delete(id: number) {
    return this.fileService.delete(id)
  }
}
