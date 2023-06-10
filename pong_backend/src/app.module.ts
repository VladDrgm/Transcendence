// import { Module } from '@nestjs/common';
// import { AppController } from './app.controller';
// import { AppService } from './app.service';
// import { HelloController } from './hello/hello.controller';
// import { DatabaseModule } from './database.module';

import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HelloController } from './hello/hello.controller';
import { DatabaseModule } from './database.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './models/orm_models/user.entity';
import { Blocked } from './models/orm_models/blocked.entity';
import { Friend } from './models/orm_models/friend.entity';
import { Match } from './models/orm_models/match.entity';
import { MatchHistory } from './models/orm_models/matchHistory.entity';
import { ChannelAdmin } from './models/orm_models/channel_admin.entity';
import { ChannelBlockedUser } from './models/orm_models/channel_blocked_user.entity';
import { ChannelUser } from './models/orm_models/channel_user.entity';
import { Channel } from './models/orm_models/channel.entity';
import { UsersController } from './controllers/user/user.controller';
import { UserService } from './services/userservice';

@Module({
  imports: [
    DatabaseModule,
    TypeOrmModule.forFeature([
      User,
      Blocked,
      Friend,
      Match,
      MatchHistory,
      ChannelAdmin,
      ChannelBlockedUser,
      ChannelUser,
      Channel,
    ]),
  ],
  controllers: [AppController, HelloController, UsersController],
  providers: [AppService, UserService],
})
export class AppModule {}
