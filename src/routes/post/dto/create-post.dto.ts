import { Type } from 'class-transformer';
import {
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

class CreatePostUserDto {
  @IsNumber()
  id: number;
}

export class CreatePostDto {
  @ValidateNested()
  @Type(() => CreatePostUserDto)
  @IsOptional()
  user: CreatePostUserDto;
  @ValidateNested()
  @Type(() => CreatePostUserDto)
  @IsOptional()
  likes: CreatePostUserDto[];
  @IsString()
  content: string;
  @IsString()
  image: string;
}
