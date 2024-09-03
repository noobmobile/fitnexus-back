import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, FindOptionsWhere, Repository } from 'typeorm';
import { BaseService } from '../../base/base.service';
import { CreateTrainingDateDto } from './dto/create-training_date.dto';
import { TrainingDateFilter } from './dto/find-training_date.dto';
import { UpdateTrainingDateDto } from './dto/update-training_date.dto';
import { TrainingDate } from './entities/training_date.entity';
import { ConquestService, PRIMEIRO_TREINO } from '../conquest/conquest.service';

@Injectable()
export class TrainingDateService extends BaseService<
  TrainingDate,
  CreateTrainingDateDto,
  UpdateTrainingDateDto
> {
  constructor(
    @InjectRepository(TrainingDate)
    private trainingdateRepository: Repository<TrainingDate>,
    private readonly conquestService: ConquestService,
  ) {
    super(trainingdateRepository);
  }

  findAll(filter: TrainingDateFilter) {
    const where = {} as FindOptionsWhere<TrainingDate>;
    if (filter.userId) where.user = { id: filter.userId };
    if (filter.isThisWeek) {
      where.date = Between(startOfWeek(), endOfWeek());
    }
    return super.findAll(filter, {
      where,
    });
  }

  async create(createDto: CreateTrainingDateDto) {
    const existing = await this.findOneBy({
      where: {
        user: { id: createDto.user.id },
        date: new Date(),
      },
    });
    if (existing) {
      throw new HttpException(
        'Training date already exists',
        HttpStatus.BAD_REQUEST,
      );
    }
    await this.checkConquests(createDto.user.id);
    return super.create(createDto);
  }

  async checkConquests(userId: number) {
    this.conquestService.addConquest(PRIMEIRO_TREINO, userId);
  }
}

function startOfWeek() {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  start.setDate(start.getDate() - start.getDay());
  return start;
}

function endOfWeek() {
  const now = new Date();
  const end = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  end.setDate(end.getDate() + (6 - end.getDay()));
  return end;
}
