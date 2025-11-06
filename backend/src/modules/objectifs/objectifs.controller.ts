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
import { ObjectifsService } from './objectifs.service';
import { CreateObjectifDto } from './dto/create-objectif.dto';
import { UpdateObjectifDto } from './dto/update-objectif.dto';

@ApiTags('objectifs')
@Controller('objectifs')
export class ObjectifsController {
  constructor(private readonly objectifsService: ObjectifsService) {}

  @Post()
  @ApiOperation({ summary: 'Créer un nouvel objectif' })
  @ApiResponse({ status: 201, description: 'Objectif créé avec succès' })
  create(@Body() createObjectifDto: CreateObjectifDto) {
    return this.objectifsService.create(createObjectifDto);
  }

  @Get()
  @ApiOperation({ summary: 'Récupérer tous les objectifs' })
  @ApiResponse({ status: 200, description: 'Liste des objectifs' })
  findAll() {
    return this.objectifsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Récupérer un objectif par ID' })
  @ApiResponse({ status: 200, description: 'Objectif trouvé' })
  @ApiResponse({ status: 404, description: 'Objectif non trouvé' })
  findOne(@Param('id') id: string) {
    return this.objectifsService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Mettre à jour un objectif' })
  @ApiResponse({ status: 200, description: 'Objectif mis à jour avec succès' })
  @ApiResponse({ status: 404, description: 'Objectif non trouvé' })
  update(@Param('id') id: string, @Body() updateObjectifDto: UpdateObjectifDto) {
    return this.objectifsService.update(+id, updateObjectifDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Supprimer un objectif' })
  @ApiResponse({ status: 204, description: 'Objectif supprimé avec succès' })
  @ApiResponse({ status: 404, description: 'Objectif non trouvé' })
  remove(@Param('id') id: string) {
    return this.objectifsService.remove(+id);
  }
}
