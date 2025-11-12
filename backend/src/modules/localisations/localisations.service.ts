import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Localisation } from './localisation.entity';
import { CreateLocalisationDto } from './dto/create-localisation.dto';
import { UpdateLocalisationDto } from './dto/update-localisation.dto';

@Injectable()
export class LocalisationsService {
  constructor(
    @InjectRepository(Localisation)
    private readonly localisationRepository: Repository<Localisation>,
  ) {}

  async findAll(): Promise<Localisation[]> {
    return this.localisationRepository.find();
  }

  async findOne(id: string): Promise<Localisation> {
    const localisation = await this.localisationRepository.findOne({ where: { id } });
    if (!localisation) {
      throw new NotFoundException(`Localisation avec l'ID ${id} non trouvée`);
    }
    return localisation;
  }

  async create(createLocalisationDto: CreateLocalisationDto): Promise<Localisation> {
    const localisation = this.localisationRepository.create(createLocalisationDto);
    return this.localisationRepository.save(localisation);
  }

  async update(id: string, updateLocalisationDto: UpdateLocalisationDto): Promise<Localisation> {
    const localisation = await this.findOne(id);
    Object.assign(localisation, updateLocalisationDto);
    return this.localisationRepository.save(localisation);
  }

  async remove(id: string): Promise<void> {
    const localisation = await this.findOne(id);
    await this.localisationRepository.remove(localisation);
  }
}
