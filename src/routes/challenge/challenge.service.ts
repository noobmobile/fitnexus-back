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
  ) {
    super(challengeRepository);
  }

  findAll(filter: ChallengeFilter) {
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
    return super.findAll(filter, {
      where,
      relations: ['requester', 'requested'],
    });
  }

  async findMyChallenges(filter: ChallengeFilter, userId: number) {
    filter.requesterId = userId;
    filter.requestedId = userId;
    return this.findAll(filter);
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
