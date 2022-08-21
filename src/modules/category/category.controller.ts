import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common'
import { CategoryService } from './category.service'
import { CreateCategoryDto, SearchCategoryDto, UpdateCategoryDto } from './dto'

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get()
  public findAll() {
    return this.categoryService.findAll()
  }

  @Get('/search')
  public search(@Query() dto: SearchCategoryDto) {
    return this.categoryService.search(dto)
  }

  @Get(':id')
  public findOne(@Param('id') id: number) {
    return this.categoryService.findOne(+id)
  }

  @UsePipes(new ValidationPipe())
  @Post()
  public save(@Body() dto: CreateCategoryDto) {
    if (!Object.keys(dto).length) {
      throw new BadRequestException('Data cannot be empty')
    }
    return this.categoryService.create(dto)
  }

  @UsePipes(new ValidationPipe())
  @Patch(':id')
  public update(@Param('id') id: number, @Body() dto: UpdateCategoryDto) {
    if (!Object.keys(dto).length) {
      throw new BadRequestException('Data cannot be empty')
    }
    return this.categoryService.update(+id, dto)
  }

  @Delete(':id')
  public remove(@Param('id') id: number) {
    return this.categoryService.remove(+id)
  }
}
