import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Objectif } from './objectif.entity';
import { ObjectifsController } from './objectifs.controller';
import { ObjectifsService } from './objectifs.service';

@Module({
  imports: [TypeOrmModule.forFeature([Objectif])],
  providers: [ObjectifsService],
  controllers: [ObjectifsController],
  exports: [ObjectifsService],
})
export class ObjectifsModule {}
