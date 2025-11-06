import { IsString, IsOptional, IsNumber, IsEnum, IsDateString } from 'class-validator';

export class CreateObjectifDto {
  @IsString()
  titre: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsNumber()
  utilisateurId?: number;

  @IsOptional()
  @IsNumber()
  localisationId?: number;

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
