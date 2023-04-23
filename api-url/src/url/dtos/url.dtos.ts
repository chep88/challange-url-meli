import { IsUrl, IsNotEmpty } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';

export class CreateUrlDto {
  @IsUrl()
  @IsNotEmpty()
  readonly url: string;
}
export class UpdateUrlDto extends PartialType(CreateUrlDto) {}
