import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
import { BaseService } from '../../base/base.service';
import { CreateChallengeDto } from './dto/create-challenge.dto';
import { UpdateChallengeDto } from './dto/update-challenge.dto';
import { Challenge } from './entities/challenge.entity';
import { ConquestService } from '../conquest/conquest.service';
import { ChallengeFilter } from './dto/find-challenge.dto';
import { ChallengeStatus } from './entities/challenge.status';
import { TrainingDateService } from '../training_dates/training_date.service';
import { TrainingDateFilter } from '../training_dates/dto/find-training_date.dto';

@Injectable()
export class ChallengeService extends BaseService<
  Challenge,
  CreateChallengeDto,
  UpdateChallengeDto
> {
  constructor(
    @InjectRepository(Challenge)
    private challengeRepository: Repository<Challenge>,
    private readonly conquestService: ConquestService,
    private readonly trainingDateService: TrainingDateService,
  ) {
    super(challengeRepository);
  }

  async findAll(filter: ChallengeFilter) {
    let where = {} as any;
    if (filter.requestedId && filter.requesterId && filter.status) {
      where = [
        { requester: { id: filter.requesterId }, status: filter.status },
        { requested: { id: filter.requestedId }, status: filter.status },
      ];
    } else {
      if (filter.status) where.status = filter.status;
      if (filter.requesterId) where.requester = { id: filter.requesterId };
      if (filter.requestedId) where.requested = { id: filter.requestedId };
    }
    const response = await super.findAll(filter, {
      where,
      relations: ['requester', 'requested'],
    });
    const challengesWithProgress = await Promise.all(
      response.data.map(async (challenge: any) => {
        const progress = await this.getChallengeProgress(challenge);
        return { ...challenge, progress };
      }),
    );
    response.data = challengesWithProgress;
    return response;
  }

  async findMyChallenges(filter: ChallengeFilter, userId: number) {
    filter.requesterId = userId;
    filter.requestedId = userId;
    return this.findAll(filter);
  }

  async getChallengeProgress(challenge: Challenge) {
    const totalGoal = challenge.workouts_goal * challenge.weeks_duration;
    const requesterTrainings = await this.trainingDateService.findAll({
      userId: challenge.requester.id,
      dateStart: challenge.start_date,
      dateEnd: challenge.end_date,
    } as TrainingDateFilter);
    const requestedTrainings = await this.trainingDateService.findAll({
      userId: challenge.requested.id,
      dateStart: challenge.start_date,
      dateEnd: challenge.end_date,
    } as TrainingDateFilter);
    const requesterProgress = requesterTrainings.data.length;
    const requestedProgress = requestedTrainings.data.length;
    const totalProgress = requesterProgress + requestedProgress;

    const percentage = Math.floor((totalProgress / totalGoal) * 100);

    return Math.min(percentage, 100);
  }

  async createChallenge(
    data: CreateChallengeDto,
    requesterId: number,
    requestedId: number,
  ) {
    // check if requester and requested are the same user
    if (requesterId === requestedId) {
      throw new HttpException(
        'You cannot challenge yourself',
        HttpStatus.BAD_REQUEST,
      );
    }
    // check if requester and requested are already in a challenge and status is different from completed
    const challenge = await this.challengeRepository.findOne({
      where: [
        {
          requester: { id: requesterId },
          requested: { id: requestedId },
          status: Not(ChallengeStatus.Completed),
        },
        {
          requester: { id: requestedId },
          requested: { id: requesterId },
          status: Not(ChallengeStatus.Completed),
        },
      ],
    });
    if (challenge) {
      throw new HttpException(
        'You are already in a challenge with this user',
        HttpStatus.BAD_REQUEST,
      );
    }
    data.requester = { id: requesterId };
    data.requested = { id: requestedId };
    data.start_date = new Date(data.start_date);
    data.end_date = new Date(
      data.start_date.getTime() + data.weeks_duration * 7 * 24 * 60 * 60 * 1000,
    );
    return this.create(data);
  }

  async acceptChallenge(challengeId: number, userId: number) {
    const challenge = await this.findOne(challengeId, {
      relations: ['requested'],
    });
    if (!challenge) {
      throw new HttpException('Challenge not found', HttpStatus.NOT_FOUND);
    }
    if (challenge.requested.id !== userId) {
      throw new HttpException(
        'You are not allowed to accept this challenge',
        HttpStatus.FORBIDDEN,
      );
    }
    challenge.status = ChallengeStatus.Accepted;
    return this.challengeRepository.save(challenge);
  }

  async rejectChallenge(challengeId: number, userId: number) {
    const challenge = await this.findOne(challengeId, {
      relations: ['requested'],
    });
    if (!challenge) {
      throw new HttpException('Challenge not found', HttpStatus.NOT_FOUND);
    }
    if (challenge.requested.id !== userId) {
      throw new HttpException(
        'You are not allowed to reject this challenge',
        HttpStatus.FORBIDDEN,
      );
    }
    await this.challengeRepository.delete(challengeId);
    return { message: 'Challenge rejected' };
  }
}
