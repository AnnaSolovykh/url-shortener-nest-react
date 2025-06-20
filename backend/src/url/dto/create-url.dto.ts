import { IsOptional, IsUrl, IsString, MaxLength } from 'class-validator';

export class CreateUrlDto {
  @IsUrl()
  originalUrl: string;

  @IsOptional()
  expiresAt?: Date;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  alias?: string;
}
