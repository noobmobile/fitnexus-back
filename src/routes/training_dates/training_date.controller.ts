import { Controller, Get, Query, Post, Body } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ControllerFactory } from '../../base/base.controller';
import { TrainingDateService } from './training_date.service';
import { CreateTrainingDateDto } from './dto/create-training_date.dto';
import {
  TrainingDateFilter,
  TrainingDateFindAllResponseType,
} from './dto/find-training_date.dto';
import { UpdateTrainingDateDto } from './dto/update-training_date.dto';
import { TrainingDate } from './entities/training_date.entity';
import { Roles } from '../auth/decorators/role.decorator';
import { UserRole } from '../auth/models/UserRole';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from '../user/entities/user.entity';

@Controller('trainingdate')
@ApiTags('trainingdate')
export class TrainingDateController extends ControllerFactory<
  TrainingDate,
  CreateTrainingDateDto,
  UpdateTrainingDateDto,
  TrainingDateFilter,
  TrainingDateFindAllResponseType
>(
  TrainingDate,
  CreateTrainingDateDto,
  UpdateTrainingDateDto,
  TrainingDateFilter,
  TrainingDateFindAllResponseType,
) {
  constructor(protected readonly service: TrainingDateService) {
    super(service);
  }

  @Get('me')
  @Roles(UserRole.User)
  findMyTrainingDates(
    @CurrentUser() user: User,
    @Query() filter: TrainingDateFilter,
  ) {
    filter.userId = user.id;
    return this.service.findAll(filter);
  }

  @Post('me')
  @Roles(UserRole.User)
  createMyTrainingDate(
    @CurrentUser() user: User,
    @Body() createDto: CreateTrainingDateDto,
  ) {
    createDto.user = { id: user.id };
    createDto.date = new Date();
    return this.service.create(createDto);
  }
}
