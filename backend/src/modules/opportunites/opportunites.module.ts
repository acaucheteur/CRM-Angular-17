import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Opportunite } from './opportunite.entity';
import { OpportunitesController } from './opportunites.controller';
import { OpportunitesService } from './opportunites.service';

@Module({
  imports: [TypeOrmModule.forFeature([Opportunite])],
  providers: [OpportunitesService],
  controllers: [OpportunitesController],
  exports: [OpportunitesService],
})
export class OpportunitesModule {}
