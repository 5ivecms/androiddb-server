import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { CategoryModule } from '../category/category.module'
import { DeveloperModule } from '../developer/developer.module'
import { ScreenshotModule } from '../screenshot/screenshot.module'
import { TagModule } from '../tag/tag.module'
import { ApplicationController } from './application.controller'
import { ApplicationEntity } from './application.entity'
import { ApplicationService } from './application.service'

@Module({
  imports: [
    TypeOrmModule.forFeature([ApplicationEntity]),
    CategoryModule,
    TagModule,
    ScreenshotModule,
    DeveloperModule,
  ],
  controllers: [ApplicationController],
  providers: [ApplicationService],
  exports: [ApplicationService],
})
export class ApplicationModule {}
