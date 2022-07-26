import { Body, Controller, Delete, Get, Param, Patch, Post, UsePipes, ValidationPipe } from '@nestjs/common'
import { CreateTagDto, UpdateTagDto } from './dto'
import { TagService } from './tag.service'

@Controller('tag')
export class TagController {
  constructor(private readonly tagService: TagService) {}

  @Get()
  public findAll() {
    return this.tagService.findAll()
  }

  @Get(':id')
  public findOne(@Param('id') id: string) {
    return this.tagService.findOne(+id)
  }

  @UsePipes(new ValidationPipe())
  @Post()
  public create(@Body() dto: CreateTagDto) {
    return this.tagService.create(dto)
  }

  @UsePipes(new ValidationPipe())
  @Patch(':id')
  public update(@Param('id') id: string, @Body() dto: UpdateTagDto) {
    return this.tagService.update(+id, dto)
  }

  @Delete(':id')
  public remove(@Param('id') id: string) {
    return this.tagService.remove(+id)
  }
}
