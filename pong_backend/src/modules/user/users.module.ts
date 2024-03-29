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
import { PasswordService } from '../password/password.service';
import { FileService } from '../fileservice/file.service';
import { AuthProtector } from '../authProtectorService/authProtector';

@Module({
  imports: [TypeOrmModule.forFeature([User, Blocked, Friend])],
  controllers: [ProfileController, UserController],
  providers: [
    ProfileService,
    SharedSession,
    UserService,
    PasswordService,
    FileService,
    AuthProtector,
  ],
  exports: [UserService],
})
export class UsersModule {}
