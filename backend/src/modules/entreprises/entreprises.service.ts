import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Entreprise } from './entreprise.entity';
import { CreateEntrepriseDto } from './dto/create-entreprise.dto';
import { UpdateEntrepriseDto } from './dto/update-entreprise.dto';

@Injectable()
export class EntreprisesService {
  constructor(
    @InjectRepository(Entreprise)
    private readonly entrepriseRepository: Repository<Entreprise>,
  ) {}

  async findAll(): Promise<Entreprise[]> {
    return this.entrepriseRepository.find();
  }

  async findOne(id: string): Promise<Entreprise> {
    const entreprise = await this.entrepriseRepository.findOne({ where: { id } });
    if (!entreprise) {
      throw new NotFoundException(`Entreprise avec l'ID ${id} non trouvée`);
    }
    return entreprise;
  }

  async create(createEntrepriseDto: CreateEntrepriseDto): Promise<Entreprise> {
    const entreprise = this.entrepriseRepository.create(createEntrepriseDto);
    return this.entrepriseRepository.save(entreprise);
  }

  async update(id: string, updateEntrepriseDto: UpdateEntrepriseDto): Promise<Entreprise> {
    const entreprise = await this.findOne(id);
    Object.assign(entreprise, updateEntrepriseDto);
    return this.entrepriseRepository.save(entreprise);
  }

  async remove(id: string): Promise<void> {
    const entreprise = await this.findOne(id);
    await this.entrepriseRepository.remove(entreprise);
  }
}
