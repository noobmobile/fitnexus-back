import { Module } from '@nestjs/common';
import { ChallengeService } from './challenge.service';
import { ChallengeController } from './challenge.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Challenge } from './entities/challenge.entity';
import { ConquestModule } from '../conquest/conquest.module';

@Module({
  imports: [TypeOrmModule.forFeature([Challenge]), ConquestModule],
  exports: [ChallengeService],
  controllers: [ChallengeController],
  providers: [ChallengeService],
})
export class ChallengeModule {}
