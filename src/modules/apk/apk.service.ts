import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository, UpdateResult } from 'typeorm'
import { Apk } from './apk.entity'
import { CreateApkDto, UpdateApkDto } from './dto'

@Injectable()
export class ApkService {
  constructor(@InjectRepository(Apk) private readonly apkRepository: Repository<Apk>) {}

  public findAll(): Promise<Apk[]> {
    return this.apkRepository.find()
  }

  public findOne(id: number): Promise<Apk> {
    return this.apkRepository.findOneBy({ id })
  }

  public create(dto: CreateApkDto): Promise<Apk> {
    return this.apkRepository.save(dto)
  }

  public async update(id: number, dto: UpdateApkDto): Promise<UpdateResult> {
    const apk = await this.apkRepository.findOneBy({ id })

    if (!apk) {
      throw new NotFoundException('Apk not found')
    }

    return this.apkRepository.update(id, dto)
  }

  public async delete(id: number) {
    const apk = await this.apkRepository.findOneBy({ id })

    if (!apk) {
      throw new NotFoundException('Apk not found')
    }

    return this.apkRepository.delete(id)
  }
}
