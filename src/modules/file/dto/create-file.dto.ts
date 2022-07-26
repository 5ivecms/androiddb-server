import { IsOptional, IsString } from 'class-validator'
import { FileType } from '../file.types'

export class CreateFileDto {
  @IsOptional()
  @IsString()
  public readonly path: string

  @IsString()
  public readonly size: string

  @IsString()
  public readonly type: FileType

  @IsString()
  public readonly mod: string
}
