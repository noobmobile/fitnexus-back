import {
  Controller,
  Get,
  Query,
  Post as PostMethod,
  Body,
  Param,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ControllerFactory } from '../../base/base.controller';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { PostFilter, PostFindAllResponseType } from './dto/find-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Post } from './entities/post.entity';
import { Roles } from '../auth/decorators/role.decorator';
import { UserRole } from '../auth/models/UserRole';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from '../user/entities/user.entity';

@Controller('post')
@ApiTags('post')
export class PostController extends ControllerFactory<
  Post,
  CreatePostDto,
  UpdatePostDto,
  PostFilter,
  PostFindAllResponseType
>(Post, CreatePostDto, UpdatePostDto, PostFilter, PostFindAllResponseType) {
  constructor(protected readonly service: PostService) {
    super(service);
  }

  @Get('me')
  @Roles(UserRole.User)
  findMyPosts(@CurrentUser() user: User, @Query() filter: PostFilter) {
    filter.userId = user.id;
    return this.service.findAll(filter);
  }

  @PostMethod('me')
  @Roles(UserRole.User)
  createMyPost(@CurrentUser() user: User, @Body() createDto: CreatePostDto) {
    createDto.user = { id: user.id };
    return this.service.create(createDto);
  }

  @PostMethod('like/:id')
  @Roles(UserRole.User)
  async like(@CurrentUser() user: User, @Param('id') id: string) {
    return this.service.likePost(user.id, +id);
  }

  @Get()
  @Roles(UserRole.User)
  findAll(@Query() filter: PostFilter) {
    return this.service.findAll(filter);
  }
}
