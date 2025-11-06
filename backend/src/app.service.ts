import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppService {
  constructor(private configService: ConfigService) {}

  getAppInfo(): object {
    return {
      name: this.configService.get('APP_NAME') || 'AFPI CRM',
      version: '1.0.0',
      description: 'API REST pour la gestion commerciale des formations AFPI',
      environment: this.configService.get('APP_ENV') || 'development',
      timestamp: new Date().toISOString(),
      endpoints: {
        docs: '/api/docs',
        health: '/api/health',
      },
    };
  }
}
