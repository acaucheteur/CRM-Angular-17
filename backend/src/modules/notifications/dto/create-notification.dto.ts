import { IsString, IsNumber, IsEnum, IsOptional, IsBoolean } from 'class-validator';

export class CreateNotificationDto {
  @IsNumber()
  utilisateurId: number;

  @IsString()
  titre: string;

  @IsString()
  message: string;

  @IsOptional()
  @IsEnum(['info', 'success', 'warning', 'error'])
  type?: string;

  @IsOptional()
  @IsBoolean()
  lu?: boolean;

  @IsOptional()
  @IsString()
  lien?: string;
}
