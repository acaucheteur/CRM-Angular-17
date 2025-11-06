import { IsString, IsOptional, IsNumber, IsEnum, IsDateString } from 'class-validator';

export class CreateOpportuniteDto {
  @IsString()
  titre: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNumber()
  entrepriseId: number;

  @IsOptional()
  @IsNumber()
  utilisateurId?: number;

  @IsOptional()
  @IsNumber()
  localisationId?: number;

  @IsOptional()
  @IsNumber()
  montant?: number;

  @IsOptional()
  @IsEnum(['nouveau', 'section1', 'section2', 'section3', 'section4', 'section5', 'section6', 'gagne', 'perdu'])
  statut?: string;

  @IsOptional()
  @IsNumber()
  section?: number;

  @IsOptional()
  @IsDateString()
  dateDebut?: string;

  @IsOptional()
  @IsDateString()
  dateFin?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}
