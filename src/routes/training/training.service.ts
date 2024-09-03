import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { BaseService } from '../../base/base.service';
import { CreateTrainingDto } from './dto/create-training.dto';
import { TrainingFilter } from './dto/find-training.dto';
import { UpdateTrainingDto } from './dto/update-training.dto';
import { Training } from './entities/training.entity';
import { BaseFilter } from 'src/base/base.filter';

@Injectable()
export class TrainingService extends BaseService<
  Training,
  CreateTrainingDto,
  UpdateTrainingDto
> {
  constructor(
    @InjectRepository(Training)
    private trainingRepository: Repository<Training>,
  ) {
    super(trainingRepository);
  }

  findAll(filter: TrainingFilter) {
    const where = {} as FindOptionsWhere<Training>;
    if (filter.name) where.name = filter.name;
    return super.findAll(filter, {
      where,
      relations: ['exercises'],
    });
  }

  async addUserToTraining(trainingId: number, userId: number) {
    const training = await super.findOne(trainingId, {
      relations: ['users'],
    });
    if (!training.users) training.users = [];
    if (training.users.find((u) => u.id === userId)) return training;
    training.users.push({ id: userId } as any);
    return this.trainingRepository.save(training);
  }

  async findUserTrainings(filter: BaseFilter, userId: number) {
    return super.findAll(filter, {
      where: { users: { id: userId } },
      relations: ['exercises', 'exercises.exercise'],
    });
  }
}
