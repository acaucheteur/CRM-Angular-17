import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { EntreprisesService } from './entreprises.service';
import { CreateEntrepriseDto } from './dto/create-entreprise.dto';
import { UpdateEntrepriseDto } from './dto/update-entreprise.dto';

@ApiTags('entreprises')
@Controller('entreprises')
export class EntreprisesController {
  constructor(private readonly entreprisesService: EntreprisesService) {}

  @Post()
  @ApiOperation({ summary: 'Créer une nouvelle entreprise' })
  @ApiResponse({ status: 201, description: 'Entreprise créée avec succès' })
  create(@Body() createEntrepriseDto: CreateEntrepriseDto) {
    return this.entreprisesService.create(createEntrepriseDto);
  }

  @Get()
  @ApiOperation({ summary: 'Récupérer toutes les entreprises' })
  @ApiResponse({ status: 200, description: 'Liste des entreprises' })
  findAll() {
    return this.entreprisesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Récupérer une entreprise par ID' })
  @ApiResponse({ status: 200, description: 'Entreprise trouvée' })
  @ApiResponse({ status: 404, description: 'Entreprise non trouvée' })
  findOne(@Param('id') id: string) {
    return this.entreprisesService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Mettre à jour une entreprise' })
  @ApiResponse({ status: 200, description: 'Entreprise mise à jour avec succès' })
  @ApiResponse({ status: 404, description: 'Entreprise non trouvée' })
  update(@Param('id') id: string, @Body() updateEntrepriseDto: UpdateEntrepriseDto) {
    return this.entreprisesService.update(+id, updateEntrepriseDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Supprimer une entreprise' })
  @ApiResponse({ status: 204, description: 'Entreprise supprimée avec succès' })
  @ApiResponse({ status: 404, description: 'Entreprise non trouvée' })
  remove(@Param('id') id: string) {
    return this.entreprisesService.remove(+id);
  }
}
