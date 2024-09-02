import { IsBoolean, IsNumber, IsOptional } from 'class-validator';
import { BaseFilter, BaseFilterResponse } from '../../../base/base.filter';
import { Notification } from '../entities/notification.entity';
import { Transform } from 'class-transformer';

export class NotificationFindAllResponseType extends BaseFilterResponse<Notification>(
  Notification,
) {}

export class NotificationFilter extends BaseFilter {
  @IsNumber()
  @IsOptional()
  userId: number;
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true')
  readed: boolean;
}
