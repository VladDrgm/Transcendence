import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './modules/database/database.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './models/orm_models/user.entity';
import { Blocked } from './models/orm_models/blocked.entity';
import { Friend } from './models/orm_models/friend.entity';
import { UsersModule } from './modules/user/users.module';
import { Match } from './models/orm_models/match.entity';
import { MatchHistory } from './models/orm_models/matchHistory.entity';
import { ChannelAdmin } from './models/orm_models/channel_admin.entity';
import { ChannelBlockedUser } from './models/orm_models/channel_blocked_user.entity';
import { ChannelUser } from './models/orm_models/channel_user.entity';
import { Channel } from './models/orm_models/channel.entity';
import { ChannelController } from './modules/channel/channel.controller';
import { ChannelService } from './modules/channel/channel.service';
import { FriendController } from './modules/friend/friend.controller';
import { MatchController } from './modules/match/match.controller';
import { FriendService } from './modules/friend/friend.service';
import { RedirectController } from './modules/redirect/redirect.controller';
import { BlockedService } from './modules/blocked/blocked.service';
import { BlockedController } from './modules/blocked/blocked.controller';
import { MatchService } from './modules/match/match.service';
import { PasswordService } from './modules/password/password.service';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AuthProtector } from './modules/authProtectorService/authProtector';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '../avatars'),
      serveRoot: '/avatars',
      serveStaticOptions: {
        redirect: false,
        index: false,
      },
    }),
    UsersModule,
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
  controllers: [
    AppController,
    ChannelController,
    FriendController,
    RedirectController,
    BlockedController,
    MatchController,
  ],
  providers: [
    AppService,
    ChannelService,
    FriendService,
    BlockedService,
    MatchService,
    PasswordService,
    AuthProtector,
  ],
})
export class AppModule {}
