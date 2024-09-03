import { Module } from '@nestjs/common';
import { ConquestService } from './conquest.service';
import { ConquestController } from './conquest.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Conquest } from './entities/conquest.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Conquest])],
  exports: [ConquestService],
  controllers: [ConquestController],
  providers: [ConquestService],
})
export class ConquestModule {}
