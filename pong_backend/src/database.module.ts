import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { config } from 'dotenv';
import { User } from './models/orm_models/user.entity';
import { Blocked } from './models/orm_models/blocked.entity';
import { Friend } from './models/orm_models/friend.entity';

config();

//!!!!!please check with Vlad for database connection information

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
      entities: [User, Blocked, Friend], // add your entity classes here
      synchronize: true, // set to false in production -> THIS SETS UP THE DATABASE AUTOMATICALLY BASED ON THE ORM MODELS
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

