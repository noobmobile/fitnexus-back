import { Module } from '@nestjs/common';
import { TrainingDateService } from './training_date.service';
import { TrainingDateController } from './training_date.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TrainingDate } from './entities/training_date.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TrainingDate])],
  exports: [TrainingDateService],
  controllers: [TrainingDateController],
  providers: [TrainingDateService],
})
export class TrainingDateModule {}
