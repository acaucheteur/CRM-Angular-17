import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Objectif } from './objectif.entity';
import { CreateObjectifDto } from './dto/create-objectif.dto';
import { UpdateObjectifDto } from './dto/update-objectif.dto';

@Injectable()
export class ObjectifsService {
  constructor(
    @InjectRepository(Objectif)
    private readonly objectifRepository: Repository<Objectif>,
  ) {}

  async findAll(): Promise<Objectif[]> {
    return this.objectifRepository.find();
  }

  async findOne(id: string): Promise<Objectif> {
    const objectif = await this.objectifRepository.findOne({ where: { id } });
    if (!objectif) {
      throw new NotFoundException(`Objectif avec l'ID ${id} non trouvé`);
    }
    return objectif;
  }

  async create(createObjectifDto: CreateObjectifDto): Promise<Objectif> {
    const objectif = this.objectifRepository.create(createObjectifDto);
    return this.objectifRepository.save(objectif);
  }

  async update(id: string, updateObjectifDto: UpdateObjectifDto): Promise<Objectif> {
    const objectif = await this.findOne(id);
    Object.assign(objectif, updateObjectifDto);
    return this.objectifRepository.save(objectif);
  }

  async remove(id: string): Promise<void> {
    const objectif = await this.findOne(id);
    await this.objectifRepository.remove(objectif);
  }
}
