import { Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ControllerFactory } from '../../base/base.controller';
import { CreateUserDto } from './dto/create-user.dto';
import { UserFilter, UserFindAllResponseType } from './dto/find-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { UserService } from './user.service';
import { Roles } from '../auth/decorators/role.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { UserRole } from '../auth/models/UserRole';
import { BaseFilter } from 'src/base/base.filter';

@Controller('user')
@ApiTags('user')
export class UserController extends ControllerFactory<
  User,
  CreateUserDto,
  UpdateUserDto,
  UserFilter,
  UserFindAllResponseType
>(User, CreateUserDto, UpdateUserDto, UserFilter, UserFindAllResponseType) {
  constructor(public readonly userService: UserService) {
    super(userService);
  }

  @Get('friends')
  @Roles(UserRole.User)
  findFriends(@Query() filter: BaseFilter, @CurrentUser() user: User) {
    return this.userService.findFriends(filter, user);
  }

  @Get('friends/suggestions')
  @Roles(UserRole.User)
  findSuggestions(@Query() filter: UserFilter, @CurrentUser() user: User) {
    return this.userService.findSuggestions(filter, user);
  }

  @Get('friends/requests')
  @Roles(UserRole.User)
  findFriendsRequests(@Query() filter: BaseFilter, @CurrentUser() user: User) {
    return this.userService.findRequests(filter, user);
  }

  @Get('friends/solicitations')
  @Roles(UserRole.User)
  findFriendsRequesteds(
    @Query() filter: BaseFilter,
    @CurrentUser() user: User,
  ) {
    return this.userService.findUsersWhoRequestedMe(filter, user);
  }

  @Post('friends/request/:id')
  @Roles(UserRole.User)
  requestFriend(@Param('id') id: number, @CurrentUser() user: User) {
    return this.userService.requestFriend(user.id, id);
  }

  @Post('friends/accept/:id')
  @Roles(UserRole.User)
  acceptFriend(@Param('id') id: number, @CurrentUser() user: User) {
    return this.userService.acceptFriend(id, user.id);
  }

  @Post('friends/reject/:id')
  @Roles(UserRole.User)
  rejectFriend(@Param('id') id: number, @CurrentUser() user: User) {
    return this.userService.rejectFriend(id, user.id);
  }

  @Get('profile/:id')
  @Roles(UserRole.User)
  findProfile(@Param('id') id: number) {
    return this.userService.findProfile(id);
  }
}
