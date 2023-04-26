import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { config } from 'dotenv';

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
      entities: [], // add your entity classes here
      synchronize: true, // set to false in production
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
