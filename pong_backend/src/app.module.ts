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

@Module({
  imports: [DatabaseModule, TypeOrmModule.forFeature([User, Blocked, Friend])],
  controllers: [AppController, HelloController],
  providers: [AppService],
})
export class AppModule {}
