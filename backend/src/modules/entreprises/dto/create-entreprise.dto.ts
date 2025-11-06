import { IsString, IsOptional, IsEmail, Length } from 'class-validator';

export class CreateEntrepriseDto {
  @IsString()
  nom: string;

  @IsString()
  @Length(14, 14)
  siret: string;

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
  secteurActivite?: string;

  @IsOptional()
  @IsString()
  telephone?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}
