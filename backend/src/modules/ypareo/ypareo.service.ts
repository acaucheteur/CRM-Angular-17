import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { YpareoConfig } from '../../database/entities/ypareo-config.entity';
import { CreateYpareoConfigDto } from './dto/create-ypareo-config.dto';
import { UpdateYpareoConfigDto } from './dto/update-ypareo-config.dto';

@Injectable()
export class YpareoService {
  constructor(
    @InjectRepository(YpareoConfig)
    private readonly ypareoConfigRepository: Repository<YpareoConfig>,
  ) {}

  async findAll(): Promise<YpareoConfig[]> {
    return this.ypareoConfigRepository.find();
  }

  async findOne(id: number): Promise<YpareoConfig> {
    const config = await this.ypareoConfigRepository.findOne({ where: { id } });
    if (!config) {
      throw new NotFoundException(`Configuration Ypareo avec l'ID ${id} non trouvée`);
    }
    return config;
  }

  async create(createYpareoConfigDto: CreateYpareoConfigDto): Promise<YpareoConfig> {
    const config = this.ypareoConfigRepository.create(createYpareoConfigDto);
    return this.ypareoConfigRepository.save(config);
  }

  async update(id: number, updateYpareoConfigDto: UpdateYpareoConfigDto): Promise<YpareoConfig> {
    const config = await this.findOne(id);
    Object.assign(config, updateYpareoConfigDto);
    return this.ypareoConfigRepository.save(config);
  }

  async remove(id: number): Promise<void> {
    const config = await this.findOne(id);
    await this.ypareoConfigRepository.remove(config);
  }
}
