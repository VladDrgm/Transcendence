import { Injectable } from '@nestjs/common';

@Injectable()
export class SharedSession {
  getMyID(sess): number | undefined {
    return parseInt(sess.userID);
  }
}
