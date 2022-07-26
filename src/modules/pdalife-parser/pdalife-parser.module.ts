import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { ApplicationVersionModule } from '../application-version/application-version.module'
import { ApplicationModule } from '../application/application.module'
import { CategoryModule } from '../category/category.module'
import { DeveloperModule } from '../developer/developer.module'
import { FileModule } from '../file/file.module'
import { ScreenshotModule } from '../screenshot/screenshot.module'
import { TagModule } from '../tag/tag.module'
import { PDALifeParserController } from './pdalife-parser.controller'
import { PDALifeParserService } from './pdalife-parser.service'

@Module({
  imports: [
    ApplicationModule,
    CategoryModule,
    TagModule,
    ConfigModule,
    ScreenshotModule,
    DeveloperModule,
    ApplicationVersionModule,
    FileModule,
  ],
  controllers: [PDALifeParserController],
  providers: [PDALifeParserService],
  exports: [PDALifeParserService],
})
export class PDALifeParserModule {}
