import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { BaseService } from '../../base/base.service';
import { CreatePostDto } from './dto/create-post.dto';
import { PostFilter } from './dto/find-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Post } from './entities/post.entity';
import { ConquestService, RECEBER_CURTIDA } from '../conquest/conquest.service';

@Injectable()
export class PostService extends BaseService<
  Post,
  CreatePostDto,
  UpdatePostDto
> {
  constructor(
    @InjectRepository(Post)
    private postRepository: Repository<Post>,
    private readonly conquestService: ConquestService,
  ) {
    super(postRepository);
  }

  findAll(filter: PostFilter) {
    const where = {} as FindOptionsWhere<Post>;
    if (filter.userId) where.user = { id: filter.userId };
    return super.findAll(filter, {
      where,
      relations: ['user', 'likes'],
    });
  }

  async likePost(userId: number, postId: number) {
    const post = await this.findOne(postId, {
      relations: ['likes', 'user'],
    });
    if (!post.likes) post.likes = [];
    if (post.likes.some((like) => like.id === userId)) {
      post.likes = post.likes.filter((like) => like.id !== userId);
    } else {
      post.likes.push({ id: userId } as any);
    }
    await this.conquestService.addConquest(RECEBER_CURTIDA, post.user.id);
    return await this.postRepository.save(post);
  }
}
