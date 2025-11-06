import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { YpareoService } from './ypareo.service';
import { CreateYpareoConfigDto } from './dto/create-ypareo-config.dto';
import { UpdateYpareoConfigDto } from './dto/update-ypareo-config.dto';

@ApiTags('ypareo')
@Controller('ypareo')
export class YpareoController {
  constructor(private readonly ypareoService: YpareoService) {}

  @Post()
  @ApiOperation({ summary: 'Créer une nouvelle configuration Ypareo' })
  @ApiResponse({ status: 201, description: 'Configuration créée avec succès' })
  create(@Body() createYpareoConfigDto: CreateYpareoConfigDto) {
    return this.ypareoService.create(createYpareoConfigDto);
  }

  @Get()
  @ApiOperation({ summary: 'Récupérer toutes les configurations Ypareo' })
  @ApiResponse({ status: 200, description: 'Liste des configurations' })
  findAll() {
    return this.ypareoService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Récupérer une configuration Ypareo par ID' })
  @ApiResponse({ status: 200, description: 'Configuration trouvée' })
  @ApiResponse({ status: 404, description: 'Configuration non trouvée' })
  findOne(@Param('id') id: string) {
    return this.ypareoService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Mettre à jour une configuration Ypareo' })
  @ApiResponse({ status: 200, description: 'Configuration mise à jour avec succès' })
  @ApiResponse({ status: 404, description: 'Configuration non trouvée' })
  update(@Param('id') id: string, @Body() updateYpareoConfigDto: UpdateYpareoConfigDto) {
    return this.ypareoService.update(+id, updateYpareoConfigDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Supprimer une configuration Ypareo' })
  @ApiResponse({ status: 204, description: 'Configuration supprimée avec succès' })
  @ApiResponse({ status: 404, description: 'Configuration non trouvée' })
  remove(@Param('id') id: string) {
    return this.ypareoService.remove(+id);
  }
}
