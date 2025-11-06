import { IsString, IsOptional, IsNumber, IsEnum, IsBoolean, IsDateString } from 'class-validator';

export class CreateYpareoConfigDto {
  @IsString()
  apiUrl: string;

  @IsString()
  apiKey: string;

  @IsOptional()
  @IsNumber()
  syncFrequency?: number;

  @IsOptional()
  @IsEnum(['read', 'write', 'read_write'])
  syncMode?: string;

  @IsOptional()
  @IsBoolean()
  enabled?: boolean;

  @IsOptional()
  @IsDateString()
  lastSync?: string;
}
