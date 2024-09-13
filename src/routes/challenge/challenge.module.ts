import { Module } from '@nestjs/common';
import { ChallengeService } from './challenge.service';
import { ChallengeController } from './challenge.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Challenge } from './entities/challenge.entity';
import { ConquestModule } from '../conquest/conquest.module';
import { TrainingDateModule } from '../training_dates/training_date.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Challenge]),
    ConquestModule,
    TrainingDateModule,
  ],
  exports: [ChallengeService],
  controllers: [ChallengeController],
  providers: [ChallengeService],
})
export class ChallengeModule {}
