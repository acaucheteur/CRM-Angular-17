import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  const configService = app.get(ConfigService);
  const port = configService.get('APP_PORT') || 3000;
  const appEnv = configService.get('APP_ENV') || 'development';

  // Enable CORS
  app.enableCors({
    origin: configService.get('FRONTEND_URL') || 'http://localhost:4200',
    credentials: true,
  });

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // API prefix
  app.setGlobalPrefix('api');

  // Swagger Documentation (only in development)
  if (appEnv === 'development') {
    const config = new DocumentBuilder()
      .setTitle('AFPI CRM API')
      .setDescription('API REST pour la gestion commerciale des formations AFPI')
      .setVersion('1.0')
      .addBearerAuth()
      .addTag('auth', 'Authentification et gestion des sessions')
      .addTag('users', 'Gestion des utilisateurs')
      .addTag('roles', 'Gestion des rôles et permissions')
      .addTag('entreprises', 'Gestion des entreprises clientes')
      .addTag('opportunites', 'Gestion des opportunités commerciales')
      .addTag('objectifs', 'Gestion des objectifs et KPIs')
      .addTag('dashboard', 'Tableaux de bord et statistiques')
      .addTag('localisations', 'Gestion des centres AFPI')
      .addTag('formateurs', 'Gestion des formateurs')
      .addTag('ypareo', 'Synchronisation avec Ypareo')
      .addTag('plugins', 'Système de plugins')
      .build();
    
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/docs', app, document);
  }

  await app.listen(port);
  
  console.log(`
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║   🎓  AFPI CRM - Backend API                             ║
║                                                           ║
║   🚀  Serveur démarré sur http://localhost:${port}       ║
║   📚  Documentation API : http://localhost:${port}/api/docs  ║
║   🌐  Environnement : ${appEnv.toUpperCase().padEnd(11)}              ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
  `);
}

bootstrap();
