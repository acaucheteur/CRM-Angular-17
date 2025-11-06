import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { PluginsService } from './plugins.service';
import { CreatePluginDto } from './dto/create-plugin.dto';
import { UpdatePluginDto } from './dto/update-plugin.dto';

@ApiTags('plugins')
@Controller('plugins')
export class PluginsController {
  constructor(private readonly pluginsService: PluginsService) {}

  @Post()
  @ApiOperation({ summary: 'Créer un nouveau plugin' })
  @ApiResponse({ status: 201, description: 'Plugin créé avec succès' })
  create(@Body() createPluginDto: CreatePluginDto) {
    return this.pluginsService.create(createPluginDto);
  }

  @Get()
  @ApiOperation({ summary: 'Récupérer tous les plugins' })
  @ApiResponse({ status: 200, description: 'Liste des plugins' })
  findAll() {
    return this.pluginsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Récupérer un plugin par ID' })
  @ApiResponse({ status: 200, description: 'Plugin trouvé' })
  @ApiResponse({ status: 404, description: 'Plugin non trouvé' })
  findOne(@Param('id') id: string) {
    return this.pluginsService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Mettre à jour un plugin' })
  @ApiResponse({ status: 200, description: 'Plugin mis à jour avec succès' })
  @ApiResponse({ status: 404, description: 'Plugin non trouvé' })
  update(@Param('id') id: string, @Body() updatePluginDto: UpdatePluginDto) {
    return this.pluginsService.update(+id, updatePluginDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Supprimer un plugin' })
  @ApiResponse({ status: 204, description: 'Plugin supprimé avec succès' })
  @ApiResponse({ status: 404, description: 'Plugin non trouvé' })
  remove(@Param('id') id: string) {
    return this.pluginsService.remove(+id);
  }
}
