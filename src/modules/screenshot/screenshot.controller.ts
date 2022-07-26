import { Controller, Get, Post, Body, Patch, Param, Delete, UsePipes, ValidationPipe } from '@nestjs/common'
import { CreateScreenshotDto, UpdateScreenshotDto } from './dto'
import { ScreenshotService } from './screenshot.service'

@Controller('screenshot')
export class ScreenshotController {
  constructor(private readonly screenshotService: ScreenshotService) {}

  @UsePipes(new ValidationPipe())
  @Post()
  public create(@Body() dto: CreateScreenshotDto) {
    return this.screenshotService.create(dto)
  }

  @Get()
  public findAll() {
    return this.screenshotService.findAll()
  }

  @Get(':id')
  public findOne(@Param('id') id: string) {
    return this.screenshotService.findOne(+id)
  }

  @UsePipes(new ValidationPipe())
  @Patch(':id')
  public update(@Param('id') id: string, @Body() dto: UpdateScreenshotDto) {
    return this.screenshotService.update(+id, dto)
  }

  @Delete(':id')
  public remove(@Param('id') id: string) {
    return this.screenshotService.remove(+id)
  }
}
