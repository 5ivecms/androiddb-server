import { IsNumber, IsOptional, IsString } from 'class-validator'

export class CreateApplicationDto {
  @IsString()
  public readonly title: string

  @IsString()
  public readonly thumb: string

  @IsString()
  @IsOptional()
  public readonly description: string

  @IsString()
  public readonly shortDescription: string

  @IsString()
  public readonly pdalifeUrl: string

  @IsOptional()
  @IsString()
  public readonly lang?: string

  @IsNumber()
  public readonly parsingStatus: number

  @IsOptional()
  @IsString()
  public readonly googlePlayUrl?: string

  @IsOptional()
  public readonly developerId?: number

  @IsOptional()
  public readonly tagIds?: number[]

  @IsOptional()
  public readonly categoryIds?: number[]

  @IsOptional()
  public readonly screenshotIds?: number[]
}
