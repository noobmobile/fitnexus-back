import { IsBoolean, IsDateString, IsNumber, IsOptional } from 'class-validator';
import { BaseFilter, BaseFilterResponse } from '../../../base/base.filter';
import { TrainingDate } from '../entities/training_date.entity';

export class TrainingDateFindAllResponseType extends BaseFilterResponse<TrainingDate>(
  TrainingDate,
) {}

export class TrainingDateFilter extends BaseFilter {
  @IsNumber()
  @IsOptional()
  userId: number;
  @IsOptional()
  @IsDateString()
  date: Date;
  @IsOptional()
  @IsBoolean()
  isThisWeek: boolean;
}
