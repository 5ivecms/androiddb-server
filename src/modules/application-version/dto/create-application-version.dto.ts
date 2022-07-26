import { IsNumber, IsOptional, IsString } from 'class-validator'

export class CreateApplicationVersionDto {
  @IsOptional()
  public readonly description: string

  @IsOptional()
  public readonly changes: string

  @IsOptional()
  public readonly version: string

  @IsNumber()
  public readonly applicationId: number

  @IsString()
  public readonly androidVersion: string

  @IsString()
  public readonly internet: string

  @IsString()
  public readonly multiplayer: string

  @IsString()
  public readonly diskSpace: string

  @IsOptional()
  public readonly fileIds: number[]
}
