import { IsString, IsOptional, IsEmail, IsArray, IsBoolean } from 'class-validator';

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
  @IsString()
  localisationId?: string;

  @IsOptional()
  @IsBoolean()
  disponible?: boolean;

  @IsOptional()
  @IsString()
  notes?: string;
}
