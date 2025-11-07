import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Localisation } from './localisation.entity';
import { LocalisationsController } from './localisations.controller';
import { LocalisationsService } from './localisations.service';

@Module({
  imports: [TypeOrmModule.forFeature([Localisation])],
  providers: [LocalisationsService],
  controllers: [LocalisationsController],
  exports: [LocalisationsService],
})
export class LocalisationsModule {}
