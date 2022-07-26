import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { In, Repository } from 'typeorm'
import { CreateScreenshotDto, UpdateScreenshotDto } from './dto'
import { Screenshot } from './entities/screenshot.entity'

@Injectable()
export class ScreenshotService {
  constructor(@InjectRepository(Screenshot) private readonly screenshotRepository: Repository<Screenshot>) {}

  public findAll(): Promise<Screenshot[]> {
    return this.screenshotRepository.find()
  }

  public findOne(id: number): Promise<Screenshot> {
    return this.screenshotRepository.findOneBy({ id })
  }

  public findByIds(ids: number[]) {
    return this.screenshotRepository.findBy({ id: In(ids) })
  }

  public create(dto: CreateScreenshotDto): Promise<Screenshot> {
    return this.screenshotRepository.save(dto)
  }

  public async update(id: number, dto: UpdateScreenshotDto) {
    const screenshot = await this.screenshotRepository.findOneBy({ id })

    if (!screenshot) {
      throw new NotFoundException('Screenshot not found')
    }

    return this.screenshotRepository.update(id, dto)
  }

  public remove(id: number) {
    return this.screenshotRepository.delete(id)
  }
}
