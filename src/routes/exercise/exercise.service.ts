import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { BaseService } from '../../base/base.service';
import { CreateExerciseDto } from './dto/create-exercise.dto';
import { ExerciseFilter } from './dto/find-exercise.dto';
import { UpdateExerciseDto } from './dto/update-exercise.dto';
import { Exercise } from './entities/exercise.entity';

@Injectable()
export class ExerciseService extends BaseService<
  Exercise,
  CreateExerciseDto,
  UpdateExerciseDto
> {
  constructor(
    @InjectRepository(Exercise)
    private exerciseRepository: Repository<Exercise>,
  ) {
    super(exerciseRepository);
  }

  findAll(filter: ExerciseFilter) {
    const where = {} as FindOptionsWhere<Exercise>;
    if (filter.name) where.name = filter.name;
    return super.findAll(filter, {
      where,
    });
  }
}
