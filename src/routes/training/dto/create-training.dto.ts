import { Type } from 'class-transformer';
import {
  IsNotEmptyObject,
  IsNumber,
  IsString,
  ValidateNested,
} from 'class-validator';

export class ExerciseDto {
  @IsNumber()
  id: number;
}

export class CreateTrainingExerciseDto {
  @IsNumber()
  load: number;
  @IsNumber()
  repetitions: number;
  @IsNumber()
  series: number;
  @ValidateNested()
  @Type(() => ExerciseDto)
  @IsNotEmptyObject()
  exercise: ExerciseDto;
}

export class CreateTrainingDto {
  @IsString()
  name: string;
  @IsString()
  image: string;
  @ValidateNested()
  @Type(() => CreateTrainingExerciseDto)
  exercises: CreateTrainingExerciseDto[];
}
