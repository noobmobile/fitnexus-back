import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEnum, IsNumber, Min, IsString } from 'class-validator';

export enum SortOrder {
  ASC = 'ASC',
  DESC = 'DESC',
}

export class BaseFilter {
  @IsNumber()
  @Min(0)
  @ApiProperty({ required: false, default: 0 })
  @Transform(({ value }) => parseInt(value))
  public offset: number = 0;

  @IsNumber()
  @Min(0)
  @ApiProperty({ required: false, default: 100 })
  @Transform(({ value }) => parseInt(value))
  public limit: number = 100;

  @IsString()
  @ApiProperty({ required: false, default: 'id' })
  public order: string = 'id';

  @IsEnum(SortOrder)
  @ApiProperty({ required: false, default: 'DESC', enum: SortOrder })
  public sort: SortOrder = SortOrder.DESC;
}

export interface IBaseFilterResponse<T> {
  data: T[];
  pagination: IPagination;
}

class IPagination {
  @ApiProperty()
  total: number;
  @ApiProperty()
  offset: number;
  @ApiProperty()
  limit: number;
  @ApiProperty()
  sort: SortOrder;
  @ApiProperty()
  order: string;
}

export function BaseFilterResponse<T>(ResourceClass) {
  class GetManyAndCount implements IBaseFilterResponse<T> {
    @ApiProperty({ type: [ResourceClass] })
    data: T[];
    @ApiProperty()
    pagination: IPagination;
  }
  return GetManyAndCount;
}
