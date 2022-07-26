import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common'
import { ApplicationVersionService } from './application-version.service'
import { CreateApplicationVersionDto, UpdateApplicationVersionDto } from './dto'

@Controller('application-version')
export class ApplicationVersionController {
  constructor(private readonly applicationVersionService: ApplicationVersionService) {}

  @Get()
  public findAll() {
    return this.applicationVersionService.findAll()
  }

  @Get(':id')
  public async findOne(@Param('id') id: number) {
    const gameVersion = await this.applicationVersionService.findOne(+id)

    if (!gameVersion) {
      throw new NotFoundException('Game version not found')
    }

    return gameVersion
  }

  @UsePipes(new ValidationPipe())
  @Post()
  public create(@Body() dto: CreateApplicationVersionDto) {
    return this.applicationVersionService.create(dto)
  }

  @UsePipes(new ValidationPipe())
  @Patch(':id')
  public async update(@Param() id: number, @Body() dto: UpdateApplicationVersionDto) {
    const gameVersion = await this.applicationVersionService.findOne(+id)

    if (!gameVersion) {
      throw new NotFoundException('Game version not found')
    }

    return this.applicationVersionService.update(id, dto)
  }

  @Delete(':id')
  public async delete(@Param('id') id: number) {
    const gameVersion = await this.applicationVersionService.findOne(+id)

    if (!gameVersion) {
      throw new NotFoundException('Game version not found')
    }

    return this.applicationVersionService.delete(id)
  }
}
