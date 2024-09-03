import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { PostModule } from '../post/post.module';
import { TrainingModule } from '../training/training.module';
import { TrainingDateModule } from '../training_dates/training_date.module';
import { ConquestModule } from '../conquest/conquest.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    PostModule,
    TrainingModule,
    TrainingDateModule,
    ConquestModule,
  ],
  exports: [UserService],
  providers: [UserService],
  controllers: [UserController],
})
export class UserModule {}
