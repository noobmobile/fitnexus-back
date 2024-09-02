import { IsNumber, IsOptional } from 'class-validator';
import { BaseFilter, BaseFilterResponse } from '../../../base/base.filter';
import { Post } from '../entities/post.entity';

export class PostFindAllResponseType extends BaseFilterResponse<Post>(Post) {}

export class PostFilter extends BaseFilter {
  @IsNumber()
  @IsOptional()
  userId: number;
}
