import { IsString, IsOptional, IsBoolean, IsArray } from 'class-validator';

export class CreatePluginDto {
  @IsString()
  nom: string;

  @IsString()
  version: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsBoolean()
  enabled?: boolean;

  @IsOptional()
  config?: any;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  hooks?: string[];
}
