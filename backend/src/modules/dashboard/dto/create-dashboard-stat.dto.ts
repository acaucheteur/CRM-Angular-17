import { IsOptional, IsNumber, IsDateString } from 'class-validator';

export class CreateDashboardStatDto {
  @IsOptional()
  @IsNumber()
  utilisateurId?: number;

  @IsOptional()
  @IsNumber()
  localisationId?: number;

  @IsDateString()
  date: string;

  @IsOptional()
  @IsNumber()
  ca?: number;

  @IsOptional()
  @IsNumber()
  nbOpportunites?: number;

  @IsOptional()
  @IsNumber()
  nbOpportunitesGagnees?: number;

  @IsOptional()
  @IsNumber()
  tauxConversion?: number;
}
