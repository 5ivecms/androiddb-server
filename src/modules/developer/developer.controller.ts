import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UsePipes, ValidationPipe } from '@nestjs/common'
import { Developer } from './developer.entity'
import { DeveloperService } from './developer.service'
import { CreateDeveloperDto, SearchDeveloperDto, UpdateDeveloperDto } from './dto'

@Controller('developer')
export class DeveloperController {
  constructor(private readonly developerService: DeveloperService) {}

  @Get()
  public findAll(): Promise<Developer[]> {
    return this.developerService.findAll()
  }

  @UsePipes(new ValidationPipe())
  @Get('/search')
  public search(@Query() dto: SearchDeveloperDto) {
    return this.developerService.search(dto)
  }

  @Get(':id')
  public findOne(@Param('id') id: number): Promise<Developer> {
    return this.developerService.findOne(id)
  }

  @UsePipes(new ValidationPipe())
  @Post()
  public create(@Body() dto: CreateDeveloperDto) {
    return this.developerService.create(dto)
  }

  @UsePipes(new ValidationPipe())
  @Patch(':id')
  public update(@Param('id') id: number, @Body() dto: UpdateDeveloperDto) {
    return this.developerService.update(id, dto)
  }

  @Delete(':id')
  public delete(@Param('id') id: number) {
    return this.developerService.delete(id)
  }
}
