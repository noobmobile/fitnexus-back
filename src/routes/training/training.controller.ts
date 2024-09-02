import {
  Controller,
  Get,
  Query,
  Body,
  Param,
  Post,
  Patch,
  Delete,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ControllerFactory } from '../../base/base.controller';
import { TrainingService } from './training.service';
import { CreateTrainingDto } from './dto/create-training.dto';
import {
  TrainingFilter,
  TrainingFindAllResponseType,
} from './dto/find-training.dto';
import { UpdateTrainingDto } from './dto/update-training.dto';
import { Training } from './entities/training.entity';
import { Roles } from '../auth/decorators/role.decorator';
import { UserRole } from '../auth/models/UserRole';
import { BaseFilter } from 'src/base/base.filter';

@Controller('training')
@ApiTags('training')
export class TrainingController extends ControllerFactory<
  Training,
  CreateTrainingDto,
  UpdateTrainingDto,
  TrainingFilter,
  TrainingFindAllResponseType
>(
  Training,
  CreateTrainingDto,
  UpdateTrainingDto,
  TrainingFilter,
  TrainingFindAllResponseType,
) {
  constructor(protected readonly service: TrainingService) {
    super(service);
  }

  @Post()
  @Roles(UserRole.Trainer)
  create(@Body() createDto: CreateTrainingDto) {
    return this.service.create(createDto);
  }

  @Get()
  @Roles(UserRole.User)
  findAll(@Query() filter: TrainingFilter) {
    return this.service.findAll(filter);
  }

  @Get(':id')
  @Roles(UserRole.User)
  findOne(@Param('id') id: string) {
    return this.service.findOne(+id);
  }

  @Patch(':id')
  @Roles(UserRole.Trainer)
  update(@Param('id') id: string, @Body() updateDto: UpdateTrainingDto) {
    return this.service.update(+id, updateDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @Roles(UserRole.Trainer)
  remove(@Param('id') id: string) {
    return this.service.remove(+id);
  }

  @Post(':id/add-user/:userId')
  @Roles(UserRole.Trainer)
  addUserToTraining(@Param('id') id: string, @Param('userId') userId: string) {
    return this.service.addUserToTraining(+id, +userId);
  }

  @Get('user/:userId')
  @Roles(UserRole.User)
  findUserTrainings(
    @Query() filter: BaseFilter,
    @Param('userId') userId: string,
  ) {
    return this.service.findUserTrainings(filter, +userId);
  }
}
