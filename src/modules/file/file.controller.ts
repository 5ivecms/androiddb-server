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
import { CreateFileDto, UpdateFileDto } from './dto'
import { FileService } from './file.service'

@Controller('file')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Get()
  public findAll() {
    return this.fileService.findAll()
  }

  @Get(':id')
  public async findOne(@Param() id: number) {
    const file = await this.fileService.findOne(+id)

    if (!file) {
      throw new NotFoundException('File not found')
    }

    return file
  }

  @UsePipes(new ValidationPipe())
  @Post()
  public create(dto: CreateFileDto) {
    return this.fileService.create(dto)
  }

  @UsePipes(new ValidationPipe())
  @Patch(':id')
  public async update(@Param('id') id: number, @Body() dto: UpdateFileDto) {
    const file = await this.fileService.findOne(+id)

    if (!file) {
      throw new NotFoundException('File not found')
    }

    return this.fileService.update(+id, dto)
  }

  @Delete(':id')
  public async delete(@Param('id') id: number) {
    const file = await this.fileService.findOne(+id)

    if (!file) {
      throw new NotFoundException('File not found')
    }

    return this.fileService.delete(id)
  }
}
