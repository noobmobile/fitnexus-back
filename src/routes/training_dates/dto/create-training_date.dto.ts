import { Type } from 'class-transformer';
import { IsDate, IsNumber, IsOptional, ValidateNested } from 'class-validator';

class CreateTrainingDateUserDto {
  @IsNumber()
  id: number;
}

export class CreateTrainingDateDto {
  @ValidateNested()
  @Type(() => CreateTrainingDateUserDto)
  @IsOptional()
  user: CreateTrainingDateUserDto;
  @IsOptional()
  @IsDate()
  date: Date;
}
