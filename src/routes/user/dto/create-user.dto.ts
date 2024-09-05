import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { UserRole } from 'src/routes/auth/models/UserRole';

export class CreateUserDto {
  @IsString()
  name: string;
  @IsString()
  image: string;
  @IsString()
  goal: string;
  @IsNumber()
  workouts_per_week: number;
  @IsString()
  description: string;
  @IsNumber()
  @IsOptional()
  age: number;
  @IsNumber()
  @IsOptional()
  weight: number;
  @IsString()
  login: string;
  @IsString()
  password: string;
  @IsEnum(UserRole)
  @IsOptional()
  role: UserRole;
}
