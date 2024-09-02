import { Controller, Get, Query, Post, Body, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ControllerFactory } from '../../base/base.controller';
import { NotificationService } from './notification.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import {
  NotificationFilter,
  NotificationFindAllResponseType,
} from './dto/find-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { Notification } from './entities/notification.entity';
import { Roles } from '../auth/decorators/role.decorator';
import { UserRole } from '../auth/models/UserRole';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from '../user/entities/user.entity';

@Controller('notification')
@ApiTags('notification')
export class NotificationController extends ControllerFactory<
  Notification,
  CreateNotificationDto,
  UpdateNotificationDto,
  NotificationFilter,
  NotificationFindAllResponseType
>(
  Notification,
  CreateNotificationDto,
  UpdateNotificationDto,
  NotificationFilter,
  NotificationFindAllResponseType,
) {
  constructor(protected readonly service: NotificationService) {
    super(service);
  }

  @Get('me')
  @Roles(UserRole.User)
  findMyNotifications(
    @CurrentUser() user: User,
    @Query() filter: NotificationFilter,
  ) {
    filter.userId = user.id;
    return this.service.findAll(filter);
  }

  @Post('me')
  @Roles(UserRole.User)
  createMyNotification(
    @CurrentUser() user: User,
    @Body() createDto: CreateNotificationDto,
  ) {
    createDto.user = { id: user.id };
    return this.service.create(createDto);
  }

  @Post('read/:id')
  @Roles(UserRole.User)
  async read(@CurrentUser() user: User, @Param('id') id: string) {
    await this.service.findOneBy({
      where: { id: +id, user: { id: user.id } },
    });
    return this.service.update(+id, {
      readed: true,
    });
  }
}
