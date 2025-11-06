import { PartialType } from '@nestjs/swagger';
import { CreateObjectifDto } from './create-objectif.dto';

export class UpdateObjectifDto extends PartialType(CreateObjectifDto) {}
