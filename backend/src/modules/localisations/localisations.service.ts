import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Localisation } from '../../database/entities/localisation.entity';
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

  async findOne(id: number): Promise<Localisation> {
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

  async update(id: number, updateLocalisationDto: UpdateLocalisationDto): Promise<Localisation> {
    await this.findOne(id);
    await this.localisationRepository.update(id, updateLocalisationDto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const localisation = await this.findOne(id);
    await this.localisationRepository.remove(localisation);
  }
}
