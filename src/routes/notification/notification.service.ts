import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { BaseService } from '../../base/base.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { NotificationFilter } from './dto/find-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { Notification } from './entities/notification.entity';

@Injectable()
export class NotificationService extends BaseService<
  Notification,
  CreateNotificationDto,
  UpdateNotificationDto
> {
  constructor(
    @InjectRepository(Notification)
    private notificationRepository: Repository<Notification>,
  ) {
    super(notificationRepository);
  }

  findAll(filter: NotificationFilter) {
    const where = {} as FindOptionsWhere<Notification>;
    if (filter.userId) where.user = { id: filter.userId };
    if (filter.readed !== undefined) where.readed = filter.readed;
    return super.findAll(filter, {
      where,
    });
  }
}
