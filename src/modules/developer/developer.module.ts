import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { DeveloperController } from './developer.controller'
import { Developer } from './developer.entity'
import { DeveloperService } from './developer.service'

@Module({
  imports: [TypeOrmModule.forFeature([Developer])],
  controllers: [DeveloperController],
  exports: [DeveloperService],
  providers: [DeveloperService],
})
export class DeveloperModule {}
