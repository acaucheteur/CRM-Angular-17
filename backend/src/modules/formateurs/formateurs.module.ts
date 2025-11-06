import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FormateursService } from './formateurs.service';
import { FormateursController } from './formateurs.controller';
import { Formateur } from '../../database/entities/formateur.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Formateur])],
  controllers: [FormateursController],
  providers: [FormateursService],
  exports: [FormateursService],
})
export class FormateursModule {}
