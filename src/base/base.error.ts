import { ApiProperty } from '@nestjs/swagger';

export class BaseError {
  @ApiProperty()
  message: string[];
  @ApiProperty()
  error: string;
  @ApiProperty()
  statusCode: number;
}
