import { IsNumberString, IsObject, IsOptional, IsString } from 'class-validator'
import { ApplicationEntity } from '../application.entity'

export class SearchApplicationDto {
  @IsOptional()
  @IsNumberString()
  public readonly page: number

  @IsOptional()
  @IsNumberString()
  public readonly limit: number

  @IsOptional()
  @IsString()
  public readonly order: string

  @IsOptional()
  @IsString()
  public readonly orderBy: string

  @IsObject()
  @IsOptional()
  public readonly search: Partial<ApplicationEntity>
}
