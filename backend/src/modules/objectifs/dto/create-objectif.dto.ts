import { IsString, IsOptional, IsNumber, IsEnum, IsDateString } from 'class-validator';

export class CreateObjectifDto {
  @IsString()
  titre: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  utilisateurId?: string;

  @IsOptional()
  @IsString()
  localisationId?: string;

  @IsEnum(['ca', 'nb_opportunites', 'taux_conversion'])
  typeObjectif: string;

  @IsNumber()
  cible: number;

  @IsOptional()
  @IsNumber()
  realise?: number;

  @IsDateString()
  dateDebut: string;

  @IsDateString()
  dateFin: string;
}
