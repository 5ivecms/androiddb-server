import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ApkController } from './apk.controller'
import { Apk } from './apk.entity'
import { ApkService } from './apk.service'

@Module({
  imports: [TypeOrmModule.forFeature([Apk])],
  controllers: [ApkController],
  providers: [ApkService],
  exports: [ApkService],
})
export class ApkModule {}
