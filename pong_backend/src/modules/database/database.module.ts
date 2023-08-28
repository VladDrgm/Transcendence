import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { config } from 'dotenv';
import { User } from '../../models/orm_models/user.entity';
import { Blocked } from '../../models/orm_models/blocked.entity';
import { Friend } from '../../models/orm_models/friend.entity';
import { MatchHistory } from '../../models/orm_models/matchHistory.entity';
import { Match } from '../../models/orm_models/match.entity';
import { ChannelAdmin } from '../../models/orm_models/channel_admin.entity';
import { Channel } from '../../models/orm_models/channel.entity';
import { ChannelBlockedUser } from '../../models/orm_models/channel_blocked_user.entity';
import { ChannelUser } from '../../models/orm_models/channel_user.entity';

config();

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOSTNAME,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: 'postgres',
      schema: 'public',
      entities: [
        User,
        Blocked,
        Friend,
        MatchHistory,
        Match,
        ChannelAdmin,
        ChannelBlockedUser,
        Channel,
        ChannelUser,
      ],
      synchronize: true, // set to false in production; true in development
      ssl: true,
      extra: {
        ssl: {
          rejectUnauthorized: false,
        },
      },
    }),
  ],
})
export class DatabaseModule {}
