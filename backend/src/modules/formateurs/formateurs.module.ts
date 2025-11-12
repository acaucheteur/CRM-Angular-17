import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Formateur } from './formateur.entity';
import { FormateursController } from './formateurs.controller';
import { FormateursService } from './formateurs.service';

@Module({
  imports: [TypeOrmModule.forFeature([Formateur])],
  providers: [FormateursService],
  controllers: [FormateursController],
  exports: [FormateursService],
})
export class FormateursModule {}
