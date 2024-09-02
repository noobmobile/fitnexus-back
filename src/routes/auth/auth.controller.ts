import {
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  UseGuards,
  Body,
  Get,
  UseInterceptors,
  ClassSerializerInterceptor,
  Patch,
  Delete,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { AuthRequest } from './models/AuthRequest';
import { IsPublic } from './decorators/is-public.decorator';
import { PublicAuthGuard } from './guards/public-auth-guard';
import { CurrentUser } from './decorators/current-user.decorator';
import { UserService } from '../user/user.service';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { User } from '../user/entities/user.entity';
import { UpdateUserDto } from '../user/dto/update-user.dto';
import { ApiBody, ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { LoginRequestBody } from './models/LoginRequestBody';
import { AuthResponse } from './models/AuthResponse';
import { BaseError } from '../../base/base.error';
import { UserRole } from './models/UserRole';

@UseInterceptors(ClassSerializerInterceptor)
@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @IsPublic()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ status: 200, type: AuthResponse })
  @ApiResponse({ status: 400, type: BaseError })
  @ApiBody({ type: LoginRequestBody })
  async login(@Request() req: AuthRequest) {
    const user: User = req.user;
    const token = await this.authService.login(user);
    return { ...user, ...token };
  }

  @IsPublic()
  @UseGuards(PublicAuthGuard)
  @Post('register')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ status: 200, type: AuthResponse })
  @ApiResponse({ status: 400, type: BaseError })
  async register(@Body() createUserDto: CreateUserDto) {
    createUserDto.role = UserRole.User;
    const user = await this.userService.create(createUserDto);
    const token = await this.authService.login(user);
    return { ...user, ...token, password: undefined };
  }

  @Get('me')
  @ApiBearerAuth()
  getMe(@CurrentUser() currentUser: User) {
    return this.userService.findOne(currentUser.id);
  }

  @Patch('me')
  @ApiBody({ type: CreateUserDto })
  @ApiBearerAuth()
  updateMe(
    @CurrentUser() currentUser: User,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    delete updateUserDto.role;
    return this.userService.update(currentUser.id, updateUserDto);
  }

  @Delete('me')
  @ApiBearerAuth()
  @ApiResponse({ status: 204 })
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteMe(@CurrentUser() currentUser: User) {
    return this.userService.remove(currentUser.id);
  }
}
