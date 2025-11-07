import { IsString, IsOptional, IsNumber, IsEnum, IsDateString } from 'class-validator';
import { OpportuniteStatut } from '../opportunite.entity';

export class CreateOpportuniteDto {
  @IsString()
  titre: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsString()
  entrepriseId: string;

  @IsOptional()
  @IsString()
  utilisateurId?: string;

  @IsOptional()
  @IsString()
  localisationId?: string;

  @IsOptional()
  @IsNumber()
  montant?: number;

  @IsOptional()
  @IsEnum(OpportuniteStatut)
  statut?: OpportuniteStatut;

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
