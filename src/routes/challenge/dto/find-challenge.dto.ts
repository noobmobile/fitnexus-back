import { IsEnum, IsNumber, IsOptional } from 'class-validator';
import { BaseFilter, BaseFilterResponse } from '../../../base/base.filter';
import { Challenge } from '../entities/challenge.entity';
import { ChallengeStatus } from '../entities/challenge.status';

export class ChallengeFindAllResponseType extends BaseFilterResponse<Challenge>(
  Challenge,
) {}

export class ChallengeFilter extends BaseFilter {
  @IsNumber()
  @IsOptional()
  requesterId: number;
  @IsNumber()
  @IsOptional()
  requestedId: number;
  @IsEnum(ChallengeStatus)
  @IsOptional()
  status: ChallengeStatus;
}
