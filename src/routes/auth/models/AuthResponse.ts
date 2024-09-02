import { ApiProperty } from '@nestjs/swagger';
import { User } from '../../user/entities/user.entity';

export class AuthResponse extends User {
  @ApiProperty()
  access_token: string;
}
