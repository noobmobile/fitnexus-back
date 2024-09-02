import { IsOptional, IsString } from 'class-validator';
import { BaseFilter, BaseFilterResponse } from '../../../base/base.filter';
import { User } from '../entities/user.entity';
import { ApiProperty } from '@nestjs/swagger';

export class UserFindAllResponseType extends BaseFilterResponse<User>(User) {}

export class UserFilter extends BaseFilter {
  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  public name: string;
}
