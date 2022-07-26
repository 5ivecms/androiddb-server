import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common'
import { ApkService } from './apk.service'
import { CreateApkDto, UpdateApkDto } from './dto'

@Controller('apk')
export class ApkController {
  constructor(private readonly apkService: ApkService) {}

  @Get()
  public findAll() {
    return this.apkService.findAll()
  }

  @Get(':id')
  public findOne(@Param('id') id: number) {
    return this.apkService.findOne(id)
  }

  @Post()
  public create(@Body() dto: CreateApkDto) {
    return this.apkService.create(dto)
  }

  @Patch(':id')
  public update(@Param('id') id: number, @Body() dto: UpdateApkDto) {
    return this.apkService.update(id, dto)
  }

  @Delete(':id')
  public delete(@Param('id') id: number) {
    return this.apkService.delete(id)
  }
}
