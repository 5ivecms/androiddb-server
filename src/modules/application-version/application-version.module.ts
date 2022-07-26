import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { FileModule } from '../file/file.module'
import { ApplicationVersionController } from './application-version.controller'
import { ApplicationVersion } from './application-version.entity'
import { ApplicationVersionService } from './application-version.service'

@Module({
  imports: [TypeOrmModule.forFeature([ApplicationVersion]), FileModule],
  controllers: [ApplicationVersionController],
  providers: [ApplicationVersionService],
  exports: [ApplicationVersionService],
})
export class ApplicationVersionModule {}
