import { IsString } from 'class-validator'

export class CreateApkDto {
  @IsString()
  public label: string

  @IsString()
  public mod: string

  @IsString()
  public path: string

  @IsString()
  public size: string
}
