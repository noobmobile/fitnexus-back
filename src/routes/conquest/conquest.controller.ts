import {
  Controller,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ConquestService } from './conquest.service';

@UseInterceptors(ClassSerializerInterceptor)
@Controller('conquest')
@ApiTags('conquest')
export class ConquestController {
  constructor(private readonly conquestService: ConquestService) {}
}
