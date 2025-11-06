import { IsString, IsOptional, IsEmail, IsArray, IsNumber, IsBoolean } from 'class-validator';

export class CreateFormateurDto {
  @IsString()
  nom: string;

  @IsString()
  prenom: string;

  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  telephone?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  specialites?: string[];

  @IsOptional()
  @IsNumber()
  localisationId?: number;

  @IsOptional()
  @IsBoolean()
  disponible?: boolean;

  @IsOptional()
  @IsString()
  notes?: string;
}
