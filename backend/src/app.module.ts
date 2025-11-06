import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { EntreprisesModule } from './modules/entreprises/entreprises.module';
import { OpportunitesModule } from './modules/opportunites/opportunites.module';
import { ObjectifsModule } from './modules/objectifs/objectifs.module';
import { LocalisationsModule } from './modules/localisations/localisations.module';
import { FormateursModule } from './modules/formateurs/formateurs.module';
import { YpareoModule } from './modules/ypareo/ypareo.module';
import { PluginsModule } from './modules/plugins/plugins.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { DashboardModule } from './modules/dashboard/dashboard.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT) || 3306,
      username: process.env.DB_USERNAME || 'afpi_crm_user',
      password: process.env.DB_PASSWORD || 'password',
      database: process.env.DB_DATABASE || 'afpi_crm',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: process.env.NODE_ENV !== 'production',
      logging: process.env.NODE_ENV === 'development',
    }),
    EntreprisesModule,
    OpportunitesModule,
    ObjectifsModule,
    LocalisationsModule,
    FormateursModule,
    YpareoModule,
    PluginsModule,
    NotificationsModule,
    DashboardModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
