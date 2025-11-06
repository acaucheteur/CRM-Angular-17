import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Plugin } from '../../database/entities/plugin.entity';
import { CreatePluginDto } from './dto/create-plugin.dto';
import { UpdatePluginDto } from './dto/update-plugin.dto';

@Injectable()
export class PluginsService {
  constructor(
    @InjectRepository(Plugin)
    private readonly pluginRepository: Repository<Plugin>,
  ) {}

  async findAll(): Promise<Plugin[]> {
    return this.pluginRepository.find();
  }

  async findOne(id: number): Promise<Plugin> {
    const plugin = await this.pluginRepository.findOne({ where: { id } });
    if (!plugin) {
      throw new NotFoundException(`Plugin avec l'ID ${id} non trouvé`);
    }
    return plugin;
  }

  async create(createPluginDto: CreatePluginDto): Promise<Plugin> {
    const plugin = this.pluginRepository.create(createPluginDto);
    return this.pluginRepository.save(plugin);
  }

  async update(id: number, updatePluginDto: UpdatePluginDto): Promise<Plugin> {
    const plugin = await this.findOne(id);
    Object.assign(plugin, updatePluginDto);
    return this.pluginRepository.save(plugin);
  }

  async remove(id: number): Promise<void> {
    const plugin = await this.findOne(id);
    await this.pluginRepository.remove(plugin);
  }
}
