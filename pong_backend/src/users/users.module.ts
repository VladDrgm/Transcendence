import { Module } from '@nestjs/common';
import { ProfileController } from './controllers/profile/profile.controller';
import { ProfileService } from './services/profile/profile.service';
import { UserController } from './controllers/user/user.controller';

@Module({
  controllers: [ProfileController, UserController],
  providers: [ProfileService]
})
export class UsersModule {}
