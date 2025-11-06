import { IsString, IsOptional, IsEmail, IsBoolean } from 'class-validator';

export class CreateLocalisationDto {
  @IsString()
  nom: string;

  @IsOptional()
  @IsString()
  adresse?: string;

  @IsOptional()
  @IsString()
  codePostal?: string;

  @IsOptional()
  @IsString()
  ville?: string;

  @IsOptional()
  @IsString()
  telephone?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsBoolean()
  actif?: boolean;
}
