import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { FindOptionsWhere, ILike, In, Repository } from 'typeorm';
import { BaseService } from '../../base/base.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UserFilter } from './dto/find-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { BaseFilter } from 'src/base/base.filter';
import { PostService } from '../post/post.service';
import { PostFilter } from '../post/dto/find-post.dto';
import { TrainingService } from '../training/training.service';
import { TrainingDateService } from '../training_dates/training_date.service';
import { TrainingDateFilter } from '../training_dates/dto/find-training_date.dto';

@Injectable()
export class UserService extends BaseService<
  User,
  CreateUserDto,
  UpdateUserDto
> {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private readonly postService: PostService,
    private readonly trainingService: TrainingService,
    private readonly trainingDateService: TrainingDateService,
  ) {
    super(userRepository);
  }

  async create(createUserDto: CreateUserDto) {
    createUserDto.password = await bcrypt.hash(createUserDto.password, 10);
    return await super.create(createUserDto);
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    if (updateUserDto.password)
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
    return await super.update(id, updateUserDto);
  }

  findAll(filter: UserFilter) {
    const where = {} as FindOptionsWhere<User>;
    if (filter.name) where.name = ILike(`%${filter.name}%`);
    return super.findAll(filter, {
      where,
    });
  }

  findOne(id: number) {
    return super.findOne(id);
  }

  async requestFriend(requesterId: number, requestedId: number) {
    if (requesterId === requestedId) {
      throw new HttpException(
        'You cannot be friends with yourself',
        HttpStatus.BAD_REQUEST,
      );
    }
    const requester = await super.findOne(requesterId, {
      relations: ['friendRequests', 'friends'],
    });
    const requested = await super.findOne(requestedId);
    if (!requester || !requested) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    if (!requester.friendRequests) requester.friendRequests = [];
    if (requester.friendRequests.find((user) => user.id === requestedId)) {
      throw new HttpException('Request already sent', HttpStatus.CONFLICT);
    }
    if (requester.friends?.find((user) => user.id === requestedId)) {
      throw new HttpException('You are already friends', HttpStatus.CONFLICT);
    }
    requester.friendRequests.push(requested);
    await this.userRepository.save(requester);
    return { status: HttpStatus.OK };
  }

  async rejectFriend(requesterId: number, requestedId: number) {
    const requester = await super.findOne(requesterId, {
      relations: ['friendRequests'],
    });
    if (!requester) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    requester.friendRequests = requester.friendRequests.filter(
      (user) => user.id !== requestedId,
    );
    await this.userRepository.save(requester);
    return { status: HttpStatus.OK };
  }

  async acceptFriend(requesterId: number, requestedId: number) {
    const requester = await super.findOne(requesterId, {
      relations: ['friends', 'friendRequests'],
    });
    const requested = await super.findOne(requestedId, {
      relations: ['friends'],
    });
    if (!requester || !requested) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    if (!requester.friendRequests) requester.friendRequests = [];
    if (!requester.friendRequests.find((user) => user.id === requestedId)) {
      throw new HttpException('Request not found', HttpStatus.NOT_FOUND);
    }
    requester.friendRequests = requester.friendRequests.filter(
      (user) => user.id !== requestedId,
    );
    if (!requester.friends) requester.friends = [];
    if (!requested.friends) requested.friends = [];
    requester.friends.push(requested);
    requested.friends.push(requester);
    await this.userRepository.save(requester);
    await this.userRepository.save(requested);
    return { status: HttpStatus.OK };
  }

  async findFriends(filter: BaseFilter, user: User) {
    const { friends } = await super.findOne(user.id, {
      relations: ['friends'],
    });
    return super.findAll(filter, {
      where: {
        id: In(friends.map((friend) => friend.id)),
      },
    });
  }

  async findRequests(filter: BaseFilter, user: User) {
    const { friendRequests } = await super.findOne(user.id, {
      relations: ['friendRequests'],
    });
    return super.findAll(filter, {
      where: {
        id: In(friendRequests.map((friend) => friend.id)),
      },
    });
  }

  async findUsersWhoRequestedMe(filter: BaseFilter, user: User) {
    // find users who want to be friends with me
    return super.findAll(filter, {
      where: {
        friendRequests: {
          id: user.id,
        },
      },
    });
  }

  async findProfile(id: number) {
    const user = (await super.findOne(id, {
      relations: ['friends', 'friendRequests'],
    })) as any;
    user.posts = (
      await this.postService.findAll({ userId: id } as PostFilter)
    ).data;
    user.trainings = (
      await this.trainingService.findUserTrainings({} as BaseFilter, id)
    ).data;
    user.training_dates = (
      await this.trainingDateService.findAll({
        userId: id,
        isThisWeek: true,
      } as TrainingDateFilter)
    ).data;
    return user;
  }
}
