import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';
import { ConquestModule } from '../conquest/conquest.module';

@Module({
  imports: [TypeOrmModule.forFeature([Post]), ConquestModule],
  exports: [PostService],
  controllers: [PostController],
  providers: [PostService],
})
export class PostModule {}
