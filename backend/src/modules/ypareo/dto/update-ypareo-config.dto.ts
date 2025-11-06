import { PartialType } from '@nestjs/swagger';
import { CreateYpareoConfigDto } from './create-ypareo-config.dto';

export class UpdateYpareoConfigDto extends PartialType(CreateYpareoConfigDto) {}
