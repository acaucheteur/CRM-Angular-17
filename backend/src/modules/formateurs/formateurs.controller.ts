import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { FormateursService } from './formateurs.service';
import { CreateFormateurDto } from './dto/create-formateur.dto';
import { UpdateFormateurDto } from './dto/update-formateur.dto';

@ApiTags('formateurs')
@Controller('formateurs')
export class FormateursController {
  constructor(private readonly formateursService: FormateursService) {}

  @Post()
  @ApiOperation({ summary: 'Créer un nouveau formateur' })
  @ApiResponse({ status: 201, description: 'Formateur créé avec succès' })
  create(@Body() createFormateurDto: CreateFormateurDto) {
    return this.formateursService.create(createFormateurDto);
  }

  @Get()
  @ApiOperation({ summary: 'Récupérer tous les formateurs' })
  @ApiResponse({ status: 200, description: 'Liste des formateurs' })
  findAll() {
    return this.formateursService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Récupérer un formateur par ID' })
  @ApiResponse({ status: 200, description: 'Formateur trouvé' })
  @ApiResponse({ status: 404, description: 'Formateur non trouvé' })
  findOne(@Param('id') id: string) {
    return this.formateursService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Mettre à jour un formateur' })
  @ApiResponse({ status: 200, description: 'Formateur mis à jour avec succès' })
  @ApiResponse({ status: 404, description: 'Formateur non trouvé' })
  update(@Param('id') id: string, @Body() updateFormateurDto: UpdateFormateurDto) {
    return this.formateursService.update(+id, updateFormateurDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Supprimer un formateur' })
  @ApiResponse({ status: 204, description: 'Formateur supprimé avec succès' })
  @ApiResponse({ status: 404, description: 'Formateur non trouvé' })
  remove(@Param('id') id: string) {
    return this.formateursService.remove(+id);
  }
}
