import { IsNumber, IsOptional, IsString } from 'class-validator'

export class CreateCategoryDto {
  @IsString()
  public title: string

  @IsNumber()
  @IsOptional()
  public parentId?: number
}
