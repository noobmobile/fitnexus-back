import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

class CreateNotificationUserDto {
  @IsNumber()
  id: number;
}

export class CreateNotificationDto {
  @ValidateNested()
  @Type(() => CreateNotificationUserDto)
  @IsOptional()
  user: CreateNotificationUserDto;
  @IsString()
  content: string;
  @IsOptional()
  @IsBoolean()
  readed: boolean;
}
