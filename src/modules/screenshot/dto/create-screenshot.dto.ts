import { IsString } from 'class-validator'

export class CreateScreenshotDto {
  @IsString()
  public url: string
}
