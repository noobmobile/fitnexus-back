import { Type } from 'class-transformer';
import {
  IsDateString,
  IsNumber,
  IsOptional,
  ValidateNested,
} from 'class-validator';

class CreateChallengeUserDto {
  @IsNumber()
  id: number;
}

export class CreateChallengeDto {
  @ValidateNested()
  @Type(() => CreateChallengeUserDto)
  @IsOptional()
  requester: CreateChallengeUserDto;
  @ValidateNested()
  @Type(() => CreateChallengeUserDto)
  @IsOptional()
  requested: CreateChallengeUserDto;
  @IsNumber()
  workouts_goal: number;
  @IsNumber()
  weeks_duration: number;
  @IsDateString()
  start_date: Date;
  @IsOptional()
  @IsDateString()
  end_date: Date;
}
