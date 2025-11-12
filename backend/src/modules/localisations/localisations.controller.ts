import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { LocalisationsService } from './localisations.service';
import { CreateLocalisationDto } from './dto/create-localisation.dto';
import { UpdateLocalisationDto } from './dto/update-localisation.dto';

@ApiTags('localisations')
@Controller('localisations')
export class LocalisationsController {
  constructor(private readonly localisationsService: LocalisationsService) {}

  @Post()
  @ApiOperation({ summary: 'Créer une nouvelle localisation' })
  @ApiResponse({ status: 201, description: 'Localisation créée avec succès' })
  create(@Body() createLocalisationDto: CreateLocalisationDto) {
    return this.localisationsService.create(createLocalisationDto);
  }

  @Get()
  @ApiOperation({ summary: 'Récupérer toutes les localisations' })
  @ApiResponse({ status: 200, description: 'Liste des localisations' })
  findAll() {
    return this.localisationsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Récupérer une localisation par ID' })
  @ApiResponse({ status: 200, description: 'Localisation trouvée' })
  @ApiResponse({ status: 404, description: 'Localisation non trouvée' })
  findOne(@Param('id') id: string) {
    return this.localisationsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Mettre à jour une localisation' })
  @ApiResponse({ status: 200, description: 'Localisation mise à jour avec succès' })
  @ApiResponse({ status: 404, description: 'Localisation non trouvée' })
  update(@Param('id') id: string, @Body() updateLocalisationDto: UpdateLocalisationDto) {
    return this.localisationsService.update(id, updateLocalisationDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Supprimer une localisation' })
  @ApiResponse({ status: 204, description: 'Localisation supprimée avec succès' })
  @ApiResponse({ status: 404, description: 'Localisation non trouvée' })
  remove(@Param('id') id: string) {
    return this.localisationsService.remove(id);
  }
}
