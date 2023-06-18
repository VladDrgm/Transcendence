import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/models/orm_models/user.entity';
import { Blocked } from 'src/models/orm_models/blocked.entity';
import { Friend } from 'src/models/orm_models/friend.entity';
import { ProfileController } from '../profile/profile.controller';
import { ProfileService } from '../profile/profile.service';
import { UserController } from './user.controller';
import { SharedSession } from '../session/shared-session.service';
import { UserService } from './userservice';

@Module({
  imports: [TypeOrmModule.forFeature([User, Blocked, Friend])],
  controllers: [ProfileController, UserController],
  providers: [ProfileService, SharedSession, UserService],
})
export class UsersModule {}
