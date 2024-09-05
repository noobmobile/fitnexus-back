import {
  Controller,
  UseInterceptors,
  ClassSerializerInterceptor,
  Get,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ConquestService } from './conquest.service';
import { Roles } from '../auth/decorators/role.decorator';
import { UserRole } from '../auth/models/UserRole';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from '../user/entities/user.entity';

@UseInterceptors(ClassSerializerInterceptor)
@Controller('conquest')
@ApiTags('conquest')
export class ConquestController {
  constructor(private readonly conquestService: ConquestService) {}

  @Get('me')
  @Roles(UserRole.User)
  findMyPosts(@CurrentUser() user: User) {
    return this.conquestService.findUserConquests(user.id);
  }
}
