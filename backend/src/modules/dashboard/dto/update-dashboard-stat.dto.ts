import { PartialType } from '@nestjs/swagger';
import { CreateDashboardStatDto } from './create-dashboard-stat.dto';

export class UpdateDashboardStatDto extends PartialType(CreateDashboardStatDto) {}
