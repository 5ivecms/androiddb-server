import { IsString } from 'class-validator'

export class CreateDeveloperDto {
  @IsString()
  public readonly name: string
}
