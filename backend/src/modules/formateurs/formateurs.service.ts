import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Formateur } from '../../database/entities/formateur.entity';
import { CreateFormateurDto } from './dto/create-formateur.dto';
import { UpdateFormateurDto } from './dto/update-formateur.dto';

@Injectable()
export class FormateursService {
  constructor(
    @InjectRepository(Formateur)
    private readonly formateurRepository: Repository<Formateur>,
  ) {}

  async findAll(): Promise<Formateur[]> {
    return this.formateurRepository.find();
  }

  async findOne(id: number): Promise<Formateur> {
    const formateur = await this.formateurRepository.findOne({ where: { id } });
    if (!formateur) {
      throw new NotFoundException(`Formateur avec l'ID ${id} non trouvé`);
    }
    return formateur;
  }

  async create(createFormateurDto: CreateFormateurDto): Promise<Formateur> {
    const formateur = this.formateurRepository.create(createFormateurDto);
    return this.formateurRepository.save(formateur);
  }

  async update(id: number, updateFormateurDto: UpdateFormateurDto): Promise<Formateur> {
    const formateur = await this.findOne(id);
    Object.assign(formateur, updateFormateurDto);
    return this.formateurRepository.save(formateur);
  }

  async remove(id: number): Promise<void> {
    const formateur = await this.findOne(id);
    await this.formateurRepository.remove(formateur);
  }
}
