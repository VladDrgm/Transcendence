import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { users } from './models/mock_data/mock_user';
import { BlockedUser, User } from './models/mock_data/local_models';
import { User as UserEntitiy, StatusValue } from './models/orm_models/user.entity';
import { Repository } from 'typeorm';
import { Blocked } from './models/orm_models/blocked.entity';
import { Friend } from './models/orm_models/friend.entity';

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(UserEntitiy)
    private readonly userRepository: Repository<UserEntitiy>,
    @InjectRepository(Blocked)
    private readonly blockedRepository: Repository<Blocked>,
    @InjectRepository(Friend)
    private readonly friendRepository: Repository<Friend>
  ) {}


  private users: User[] = users;




  getUsers(): User[] {
    return this.users;
  }
  getHello(): string {
    return 'Hello World!';
  }

  async createDummyDB()
  {
    const users: UserEntitiy[] = [];

    for (let i = 0; i < 50; i++) {
      const user = new UserEntitiy();
      user.username = `user${i}`;
      user.avatarPath = `avatar${i}.jpg`;
      user.wins = Math.floor(Math.random() * 100);
      user.losses = Math.floor(Math.random() * 100);
      user.ladderLevel = Math.floor(Math.random() * 20);
      user.status = StatusValue.Available;
      user.achievementsCSV = 'achievement1,achievement2';
      user.passwordHash = 'password123';
      users.push(user);
    }
    await this.userRepository.save(users);

    // Randomly connect users as friends or block each other
    for (const user of users) {
      const friendsCount = Math.floor(Math.random() * 10);
      const friends = users
        .filter((u) => u.userID !== user.userID) // exclude the user itself
        .sort(() => Math.random() - 0.5) // shuffle the array
        .slice(0, friendsCount); // take random friendsCount number of users

      for (const friend of friends) {
        if (Math.random() < 0.1) {
          const block = new Blocked();
          block.user = user;
          block.blockedUser = friend;
          await this.blockedRepository.save(block);
        }
        else if (Math.random() < 0.4) {
          const friendU = new Friend();
          friendU.user = user;
          friendU.friendUser = friend;
          await this.friendRepository.save(friendU);
          const friendU2 = new Friend();
          friendU2.user = friend;
          friendU2.friendUser = user;
          await this.friendRepository.save(friendU2);
        }
      }
    }
  }
}
