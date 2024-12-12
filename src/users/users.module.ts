import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from './users.entity';
import { Scores } from '../entity/scores.entity';
import { Hobby } from '../entity/hobby.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Users, Scores, Hobby])],
  providers: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {}
