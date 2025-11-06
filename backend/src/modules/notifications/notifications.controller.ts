import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { NotificationsService } from './notifications.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';

@ApiTags('notifications')
@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Post()
  @ApiOperation({ summary: 'Créer une nouvelle notification' })
  @ApiResponse({ status: 201, description: 'Notification créée avec succès' })
  create(@Body() createNotificationDto: CreateNotificationDto) {
    return this.notificationsService.create(createNotificationDto);
  }

  @Get()
  @ApiOperation({ summary: 'Récupérer toutes les notifications' })
  @ApiResponse({ status: 200, description: 'Liste des notifications' })
  findAll() {
    return this.notificationsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Récupérer une notification par ID' })
  @ApiResponse({ status: 200, description: 'Notification trouvée' })
  @ApiResponse({ status: 404, description: 'Notification non trouvée' })
  findOne(@Param('id') id: string) {
    return this.notificationsService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Mettre à jour une notification' })
  @ApiResponse({ status: 200, description: 'Notification mise à jour avec succès' })
  @ApiResponse({ status: 404, description: 'Notification non trouvée' })
  update(@Param('id') id: string, @Body() updateNotificationDto: UpdateNotificationDto) {
    return this.notificationsService.update(+id, updateNotificationDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Supprimer une notification' })
  @ApiResponse({ status: 204, description: 'Notification supprimée avec succès' })
  @ApiResponse({ status: 404, description: 'Notification non trouvée' })
  remove(@Param('id') id: string) {
    return this.notificationsService.remove(+id);
  }
}
