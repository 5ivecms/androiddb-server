import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common'
import { ApplicationEntity } from './application.entity'
import { ApplicationService } from './application.service'
import { CreateApplicationDto, SearchApplicationDto, UpdateApplicationDto } from './dto'

@Controller('applications')
export class ApplicationController {
  constructor(private readonly applicationService: ApplicationService) {}

  @HttpCode(HttpStatus.OK)
  @Get()
  public findAll(): Promise<ApplicationEntity[]> {
    return this.applicationService.findAll()
  }

  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe())
  @Get('/search')
  public search(@Query() dto: SearchApplicationDto) {
    return this.applicationService.search(dto)
  }

  @HttpCode(HttpStatus.OK)
  @Get(':id')
  public findOne(@Param('id') id: number): Promise<ApplicationEntity> {
    return this.applicationService.findOne(id)
  }

  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe())
  @Post()
  public create(@Body() dto: CreateApplicationDto) {
    return this.applicationService.create(dto)
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.OK)
  @Put(':id')
  public update(@Body() dto: UpdateApplicationDto, @Param('id') id: number) {
    return this.applicationService.update(id, dto)
  }

  @HttpCode(HttpStatus.OK)
  @Delete(':id')
  public delete(@Param('id') id: number) {
    return this.applicationService.delete(id)
  }
}
