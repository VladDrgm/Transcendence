import { Injectable } from '@nestjs/common';
import { User } from 'src/models/mock_data/local_models';

@Injectable()
export class SharedUser {

    isFriend(myID:number, friendID:number):boolean //todo: Implement this.
    {
        return (true);
    }

    findUser(userID:number)
    {
        return (true)
    }

}