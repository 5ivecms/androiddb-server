import { Module } from '@nestjs/common'
import { ServeStaticModule } from '@nestjs/serve-static'
import { TypeOrmModule } from '@nestjs/typeorm'
import { path } from 'app-root-path'
import { Screenshot } from './entities/screenshot.entity'
import { ScreenshotController } from './screenshot.controller'
import { ScreenshotService } from './screenshot.service'

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: `${path}/uploads`,
      serveRoot: '/uploads',
      exclude: ['/api*'],
      serveStaticOptions: {
        index: false,
      },
    }),
    TypeOrmModule.forFeature([Screenshot]),
  ],
  controllers: [ScreenshotController],
  providers: [ScreenshotService],
  exports: [ScreenshotService],
})
export class ScreenshotModule {}
