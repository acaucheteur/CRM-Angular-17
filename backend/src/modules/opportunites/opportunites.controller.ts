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
import { OpportunitesService } from './opportunites.service';
import { CreateOpportuniteDto } from './dto/create-opportunite.dto';
import { UpdateOpportuniteDto } from './dto/update-opportunite.dto';

@ApiTags('opportunites')
@Controller('opportunites')
export class OpportunitesController {
  constructor(private readonly opportunitesService: OpportunitesService) {}

  @Post()
  @ApiOperation({ summary: 'Créer une nouvelle opportunité' })
  @ApiResponse({ status: 201, description: 'Opportunité créée avec succès' })
  create(@Body() createOpportuniteDto: CreateOpportuniteDto) {
    return this.opportunitesService.create(createOpportuniteDto);
  }

  @Get()
  @ApiOperation({ summary: 'Récupérer toutes les opportunités' })
  @ApiResponse({ status: 200, description: 'Liste des opportunités' })
  findAll() {
    return this.opportunitesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Récupérer une opportunité par ID' })
  @ApiResponse({ status: 200, description: 'Opportunité trouvée' })
  @ApiResponse({ status: 404, description: 'Opportunité non trouvée' })
  findOne(@Param('id') id: string) {
    return this.opportunitesService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Mettre à jour une opportunité' })
  @ApiResponse({ status: 200, description: 'Opportunité mise à jour avec succès' })
  @ApiResponse({ status: 404, description: 'Opportunité non trouvée' })
  update(@Param('id') id: string, @Body() updateOpportuniteDto: UpdateOpportuniteDto) {
    return this.opportunitesService.update(id, updateOpportuniteDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Supprimer une opportunité' })
  @ApiResponse({ status: 204, description: 'Opportunité supprimée avec succès' })
  @ApiResponse({ status: 404, description: 'Opportunité non trouvée' })
  remove(@Param('id') id: string) {
    return this.opportunitesService.remove(id);
  }
}
