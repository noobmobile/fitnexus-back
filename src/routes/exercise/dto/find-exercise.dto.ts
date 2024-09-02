import { IsOptional, IsString } from 'class-validator';
import { BaseFilter, BaseFilterResponse } from '../../../base/base.filter';
import { Exercise } from '../entities/exercise.entity';

export class ExerciseFindAllResponseType extends BaseFilterResponse<Exercise>(
  Exercise,
) {}

export class ExerciseFilter extends BaseFilter {
  @IsOptional()
  @IsString()
  name: string;
}
