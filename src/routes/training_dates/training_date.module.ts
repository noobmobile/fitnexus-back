import { Module } from '@nestjs/common';
import { TrainingDateService } from './training_date.service';
import { TrainingDateController } from './training_date.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TrainingDate } from './entities/training_date.entity';
import { ConquestModule } from '../conquest/conquest.module';

@Module({
  imports: [TypeOrmModule.forFeature([TrainingDate]), ConquestModule],
  exports: [TrainingDateService],
  controllers: [TrainingDateController],
  providers: [TrainingDateService],
})
export class TrainingDateModule {}
