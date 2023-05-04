import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/models/orm_models/user.entity'; 
import { Blocked } from 'src/models/orm_models/blocked.entity';
import { Friend } from 'src/models/orm_models/friend.entity';
import { ProfileController } from './controllers/profile/profile.controller';
import { ProfileService } from './services/profile/profile.service';
import { UserController } from './controllers/user/user.controller';
import { SharedSession } from 'src/shared/services/session/shared-session.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, Blocked, Friend])],
  controllers: [ProfileController, UserController],
  providers: [ProfileService, SharedSession]
})
export class UsersModule {}
