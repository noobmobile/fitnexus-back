import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ControllerFactory } from '../../base/base.controller';
import { ChallengeService } from './challenge.service';
import { CreateChallengeDto } from './dto/create-challenge.dto';
import {
  ChallengeFilter,
  ChallengeFindAllResponseType,
} from './dto/find-challenge.dto';
import { UpdateChallengeDto } from './dto/update-challenge.dto';
import { Challenge } from './entities/challenge.entity';
import { UserRole } from '../auth/models/UserRole';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from '../user/entities/user.entity';
import { Roles } from '../auth/decorators/role.decorator';

@Controller('challenge')
@ApiTags('challenge')
export class ChallengeController extends ControllerFactory<
  Challenge,
  CreateChallengeDto,
  UpdateChallengeDto,
  ChallengeFilter,
  ChallengeFindAllResponseType
>(
  Challenge,
  CreateChallengeDto,
  UpdateChallengeDto,
  ChallengeFilter,
  ChallengeFindAllResponseType,
) {
  constructor(protected readonly service: ChallengeService) {
    super(service);
  }

  @Get('pending')
  @Roles(UserRole.User)
  async findRequestedsChallenges(
    @CurrentUser() user: User,
    @Query() filter: ChallengeFilter,
  ) {
    return this.service.findRequestedsChallenges(filter, user.id);
  }

  @Get('me')
  @Roles(UserRole.User)
  async findMyChallenges(
    @CurrentUser() user: User,
    @Query() filter: ChallengeFilter,
  ) {
    return this.service.findMyChallenges(filter, user.id);
  }

  @Post('create/:requestedId')
  @Roles(UserRole.User)
  async createChallenge(
    @CurrentUser() user: User,
    @Body() data: CreateChallengeDto,
    @Param('requestedId') requestedId: number,
  ) {
    return this.service.createChallenge(data, user.id, requestedId);
  }

  @Post('accept/:challengeId')
  @Roles(UserRole.User)
  async acceptChallenge(
    @CurrentUser() user: User,
    @Param('challengeId') challengeId: number,
  ) {
    return this.service.acceptChallenge(challengeId, user.id);
  }

  @Post('reject/:challengeId')
  @Roles(UserRole.User)
  async rejectChallenge(
    @CurrentUser() user: User,
    @Param('challengeId') challengeId: number,
  ) {
    return this.service.rejectChallenge(challengeId, user.id);
  }
}
