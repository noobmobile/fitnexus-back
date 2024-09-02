import { PartialType } from '@nestjs/mapped-types';
import { CreateTrainingDateDto } from './create-training_date.dto';

export class UpdateTrainingDateDto extends PartialType(CreateTrainingDateDto) {}
