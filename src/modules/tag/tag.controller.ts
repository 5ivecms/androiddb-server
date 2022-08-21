import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common'
import { CreateTagDto, SearchTagDto, UpdateTagDto } from './dto'
import { TagService } from './tag.service'

@Controller('tag')
export class TagController {
  constructor(private readonly tagService: TagService) {}

  @HttpCode(HttpStatus.OK)
  @Get()
  public findAll() {
    return this.tagService.findAll()
  }

  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe())
  @Get('/search')
  public search(@Query() dto: SearchTagDto) {
    return this.tagService.search(dto)
  }

  @HttpCode(HttpStatus.OK)
  @Get(':id')
  public findOne(@Param('id') id: string) {
    return this.tagService.findOne(+id)
  }

  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe())
  @Post()
  public create(@Body() dto: CreateTagDto) {
    return this.tagService.create(dto)
  }

  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe())
  @Patch(':id')
  public update(@Param('id') id: string, @Body() dto: UpdateTagDto) {
    return this.tagService.update(+id, dto)
  }

  @HttpCode(HttpStatus.OK)
  @Delete(':id')
  public remove(@Param('id') id: string) {
    return this.tagService.remove(+id)
  }
}
