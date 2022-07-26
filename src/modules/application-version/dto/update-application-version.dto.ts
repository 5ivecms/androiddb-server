import { PartialType } from '@nestjs/mapped-types'
import { CreateApplicationVersionDto } from './create-application-version.dto'

export class UpdateApplicationVersionDto extends PartialType(CreateApplicationVersionDto) {}
