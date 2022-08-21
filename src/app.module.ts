import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import * as Joi from 'joi'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { databaseConfig, serverConfig, storageConfig } from './config'
import { ApplicationVersionModule } from './modules/application-version/application-version.module'
import { ApplicationModule } from './modules/application/application.module'
import { CategoryModule } from './modules/category/category.module'
import { DatabaseModule } from './modules/database/database.module'
import { DeveloperModule } from './modules/developer/developer.module'
import { FileModule } from './modules/file/file.module'
import { PDALifeParserModule } from './modules/pdalife-parser/pdalife-parser.module'
import { ScreenshotModule } from './modules/screenshot/screenshot.module'
import { TagModule } from './modules/tag/tag.module'

const ENV = process.env.NODE_ENV

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: !ENV ? '.env.dev' : `.env.${ENV}`,
      load: [databaseConfig, serverConfig, storageConfig],
      validationSchema: Joi.object({
        NODE_ENV: Joi.string().valid('dev', 'prod').default('dev'),
        POSTGRES_HOST: Joi.string().required(),
        POSTGRES_PORT: Joi.number().required(),
        POSTGRES_USER: Joi.string().required(),
        POSTGRES_PASSWORD: Joi.string().required(),
        POSTGRES_DB: Joi.string().required(),
        PORT: Joi.number().default(5000),
        UPLOADS_FOLDER: Joi.string().required(),
        SCREENSHOTS_FOLDER: Joi.string().required(),
      }),
    }),
    DatabaseModule,
    PDALifeParserModule,
    ApplicationModule,
    CategoryModule,
    ScreenshotModule,
    TagModule,
    DeveloperModule,
    ApplicationVersionModule,
    FileModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
