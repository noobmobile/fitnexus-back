import { Module } from '@nestjs/common';
import { TrainingService } from './training.service';
import { TrainingController } from './training.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Training } from './entities/training.entity';
import { TrainingExercise } from './entities/training.exercise.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Training, TrainingExercise])],
  exports: [TrainingService],
  controllers: [TrainingController],
  providers: [TrainingService],
})
export class TrainingModule {}
