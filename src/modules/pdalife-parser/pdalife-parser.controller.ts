import { Controller, Get } from '@nestjs/common'
import { getGameCategoryUrl, getSoftCategoryUrl } from './pdalife-parser.routes'
import { PDALifeParserService } from './pdalife-parser.service'

@Controller('pdalife-parser')
export class PDALifeParserController {
  constructor(private readonly pdalifeParserService: PDALifeParserService) {}

  @Get('parse-catalog')
  public async parseCatalog() {
    await this.pdalifeParserService.parseCatalog()
  }

  @Get('parse-full-app')
  public async parseApplication() {
    return await this.pdalifeParserService.parseFullApp()
  }

  @Get('parse-categories')
  public async parseCategories() {
    await this.pdalifeParserService.parseCategories(getGameCategoryUrl(), 'Игры')
    await this.pdalifeParserService.parseCategories(getSoftCategoryUrl(), 'Программы')
  }
}
