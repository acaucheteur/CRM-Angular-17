import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { YpareoService } from './ypareo.service';
import { YpareoController } from './ypareo.controller';
import { YpareoConfig } from '../../database/entities/ypareo-config.entity';

@Module({
  imports: [TypeOrmModule.forFeature([YpareoConfig])],
  controllers: [YpareoController],
  providers: [YpareoService],
  exports: [YpareoService],
})
export class YpareoModule {}
