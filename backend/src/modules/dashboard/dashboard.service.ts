import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DashboardStat } from '../../database/entities/dashboard-stat.entity';
import { CreateDashboardStatDto } from './dto/create-dashboard-stat.dto';
import { UpdateDashboardStatDto } from './dto/update-dashboard-stat.dto';

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(DashboardStat)
    private readonly dashboardStatRepository: Repository<DashboardStat>,
  ) {}

  async findAll(): Promise<DashboardStat[]> {
    return this.dashboardStatRepository.find();
  }

  async findOne(id: number): Promise<DashboardStat> {
    const stat = await this.dashboardStatRepository.findOne({ where: { id } });
    if (!stat) {
      throw new NotFoundException(`Statistique dashboard avec l'ID ${id} non trouvée`);
    }
    return stat;
  }

  async create(createDashboardStatDto: CreateDashboardStatDto): Promise<DashboardStat> {
    const stat = this.dashboardStatRepository.create(createDashboardStatDto);
    return this.dashboardStatRepository.save(stat);
  }

  async update(id: number, updateDashboardStatDto: UpdateDashboardStatDto): Promise<DashboardStat> {
    const stat = await this.findOne(id);
    Object.assign(stat, updateDashboardStatDto);
    return this.dashboardStatRepository.save(stat);
  }

  async remove(id: number): Promise<void> {
    const stat = await this.findOne(id);
    await this.dashboardStatRepository.remove(stat);
  }
}
