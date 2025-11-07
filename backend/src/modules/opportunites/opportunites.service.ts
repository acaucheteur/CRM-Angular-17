import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Opportunite } from './opportunite.entity';
import { CreateOpportuniteDto } from './dto/create-opportunite.dto';
import { UpdateOpportuniteDto } from './dto/update-opportunite.dto';

@Injectable()
export class OpportunitesService {
  constructor(
    @InjectRepository(Opportunite)
    private readonly opportuniteRepository: Repository<Opportunite>,
  ) {}

  async findAll(): Promise<Opportunite[]> {
    return this.opportuniteRepository.find();
  }

  async findOne(id: string): Promise<Opportunite> {
    const opportunite = await this.opportuniteRepository.findOne({ where: { id } });
    if (!opportunite) {
      throw new NotFoundException(`Opportunité avec l'ID ${id} non trouvée`);
    }
    return opportunite;
  }

  async create(createOpportuniteDto: CreateOpportuniteDto): Promise<Opportunite> {
    const opportunite = this.opportuniteRepository.create(createOpportuniteDto);
    return this.opportuniteRepository.save(opportunite);
  }

  async update(id: string, updateOpportuniteDto: UpdateOpportuniteDto): Promise<Opportunite> {
    const opportunite = await this.findOne(id);
    Object.assign(opportunite, updateOpportuniteDto);
    return this.opportuniteRepository.save(opportunite);
  }

  async remove(id: string): Promise<void> {
    const opportunite = await this.findOne(id);
    await this.opportuniteRepository.remove(opportunite);
  }
}
