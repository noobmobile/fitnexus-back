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
import { ExerciseService } from './exercise.service';
import { CreateExerciseDto } from './dto/create-exercise.dto';
import {
  ExerciseFilter,
  ExerciseFindAllResponseType,
} from './dto/find-exercise.dto';
import { UpdateExerciseDto } from './dto/update-exercise.dto';
import { Exercise } from './entities/exercise.entity';
import { Roles } from '../auth/decorators/role.decorator';
import { UserRole } from '../auth/models/UserRole';

@Controller('exercise')
@ApiTags('exercise')
export class ExerciseController extends ControllerFactory<
  Exercise,
  CreateExerciseDto,
  UpdateExerciseDto,
  ExerciseFilter,
  ExerciseFindAllResponseType
>(
  Exercise,
  CreateExerciseDto,
  UpdateExerciseDto,
  ExerciseFilter,
  ExerciseFindAllResponseType,
) {
  constructor(protected readonly service: ExerciseService) {
    super(service);
  }

  @Post()
  @Roles(UserRole.Trainer)
  create(@Body() createDto: CreateExerciseDto) {
    return this.service.create(createDto);
  }

  @Get()
  @Roles(UserRole.User)
  findAll(@Query() filter: ExerciseFilter) {
    return this.service.findAll(filter);
  }

  @Get(':id')
  @Roles(UserRole.User)
  findOne(@Param('id') id: string) {
    return this.service.findOne(+id);
  }

  @Patch(':id')
  @Roles(UserRole.Trainer)
  update(@Param('id') id: string, @Body() updateDto: UpdateExerciseDto) {
    return this.service.update(+id, updateDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @Roles(UserRole.Trainer)
  remove(@Param('id') id: string) {
    return this.service.remove(+id);
  }
}
