import { IsOptional, IsString } from 'class-validator';
import { BaseFilter, BaseFilterResponse } from '../../../base/base.filter';
import { Training } from '../entities/training.entity';

export class TrainingFindAllResponseType extends BaseFilterResponse<Training>(
  Training,
) {}

export class TrainingFilter extends BaseFilter {
  @IsOptional()
  @IsString()
  name: string;
}
