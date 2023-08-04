import { Injectable } from '@nestjs/common';

@Injectable()
export class SharedUser {
  isFriend(myID: number, friendID: number): boolean {
    //todo: Implement this.
    return true;
  }

  findUser(userID: number) {
    return true;
  }
}
