import { Transform } from 'class-transformer';
import { IsOptional, IsUrl, IsString, MaxLength } from 'class-validator';

export class CreateUrlDto {
  @IsUrl()
  @Transform(({ value }) => value.trim())
  originalUrl: string;

  @IsOptional()
  @Transform(({ value }) => new Date(value))
  expiresAt?: Date;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  @Transform(({ value }) => value?.trim())
  alias?: string;
}
