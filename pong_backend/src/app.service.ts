import { Injectable } from '@nestjs/common';
import { users } from './models/mock_data/mock_user';
import { User } from './models/mock_data/local_models';

@Injectable()
export class AppService {
  private users: User[] = users;

  getUsers(): User[] {
    return this.users;
  }
  getHello(): string {
    return 'Hello World!';
  }
}
