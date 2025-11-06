import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { DashboardService } from './dashboard.service';
import { CreateDashboardStatDto } from './dto/create-dashboard-stat.dto';
import { UpdateDashboardStatDto } from './dto/update-dashboard-stat.dto';

@ApiTags('dashboard')
@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Post()
  @ApiOperation({ summary: 'Créer une nouvelle statistique dashboard' })
  @ApiResponse({ status: 201, description: 'Statistique créée avec succès' })
  create(@Body() createDashboardStatDto: CreateDashboardStatDto) {
    return this.dashboardService.create(createDashboardStatDto);
  }

  @Get()
  @ApiOperation({ summary: 'Récupérer toutes les statistiques dashboard' })
  @ApiResponse({ status: 200, description: 'Liste des statistiques' })
  findAll() {
    return this.dashboardService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Récupérer une statistique dashboard par ID' })
  @ApiResponse({ status: 200, description: 'Statistique trouvée' })
  @ApiResponse({ status: 404, description: 'Statistique non trouvée' })
  findOne(@Param('id') id: string) {
    return this.dashboardService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Mettre à jour une statistique dashboard' })
  @ApiResponse({ status: 200, description: 'Statistique mise à jour avec succès' })
  @ApiResponse({ status: 404, description: 'Statistique non trouvée' })
  update(@Param('id') id: string, @Body() updateDashboardStatDto: UpdateDashboardStatDto) {
    return this.dashboardService.update(+id, updateDashboardStatDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Supprimer une statistique dashboard' })
  @ApiResponse({ status: 204, description: 'Statistique supprimée avec succès' })
  @ApiResponse({ status: 404, description: 'Statistique non trouvée' })
  remove(@Param('id') id: string) {
    return this.dashboardService.remove(+id);
  }
}
