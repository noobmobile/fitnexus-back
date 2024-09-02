import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { BaseService } from '../../base/base.service';
import { CreateTrainingDateDto } from './dto/create-training_date.dto';
import { TrainingDateFilter } from './dto/find-training_date.dto';
import { UpdateTrainingDateDto } from './dto/update-training_date.dto';
import { TrainingDate } from './entities/training_date.entity';

@Injectable()
export class TrainingDateService extends BaseService<
  TrainingDate,
  CreateTrainingDateDto,
  UpdateTrainingDateDto
> {
  constructor(
    @InjectRepository(TrainingDate)
    private trainingdateRepository: Repository<TrainingDate>,
  ) {
    super(trainingdateRepository);
  }

  findAll(filter: TrainingDateFilter) {
    const where = {} as FindOptionsWhere<TrainingDate>;
    if (filter.userId) where.user = { id: filter.userId };
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
    return super.create(createDto);
  }
}
