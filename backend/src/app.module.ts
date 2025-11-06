import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { BullModule } from '@nestjs/bull';
import { AppController } from './app.controller';
import { AppService } from './app.service';

// Configuration
import { typeOrmConfig } from './config/typeorm.config';

// Modules fonctionnels
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { RolesModule } from './modules/roles/roles.module';
import { EntreprisesModule } from './modules/entreprises/entreprises.module';
import { OpportunitesModule } from './modules/opportunites/opportunites.module';
import { ObjectifsModule } from './modules/objectifs/objectifs.module';
import { DashboardModule } from './modules/dashboard/dashboard.module';
import { LocalisationsModule } from './modules/localisations/localisations.module';
import { FormateursModule } from './modules/formateurs/formateurs.module';
import { YpareoModule } from './modules/ypareo/ypareo.module';
import { PluginsModule } from './modules/plugins/plugins.module';
import { NotificationsModule } from './modules/notifications/notifications.module';

@Module({
  imports: [
    // Configuration globale
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    // TypeORM - Base de données
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => typeOrmConfig(configService),
      inject: [ConfigService],
    }),

    // Schedule pour les tâches CRON
    ScheduleModule.forRoot(),

    // Bull Queue pour les tâches asynchrones
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        redis: {
          host: configService.get('REDIS_HOST') || 'localhost',
          port: configService.get('REDIS_PORT') || 6379,
          password: configService.get('REDIS_PASSWORD') || undefined,
        },
      }),
      inject: [ConfigService],
    }),

    // Modules de l'application
    AuthModule,
    UsersModule,
    RolesModule,
    EntreprisesModule,
    OpportunitesModule,
    ObjectifsModule,
    DashboardModule,
    LocalisationsModule,
    FormateursModule,
    YpareoModule,
    PluginsModule,
    NotificationsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
