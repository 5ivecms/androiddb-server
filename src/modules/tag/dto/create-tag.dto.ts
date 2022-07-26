import { IsString } from 'class-validator'

export class CreateTagDto {
  @IsString()
  public title: string
}
