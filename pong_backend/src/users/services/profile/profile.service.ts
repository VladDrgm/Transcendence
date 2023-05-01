import { Injectable } from '@nestjs/common';
import { PublicProfile } from 'src/shared/interfaces/profiles/public_profile.interface';
import { FriendProfile } from 'src/shared/interfaces/profiles/friend_profile.interface';
import { User } from 'src/models/mock_data/local_models';

@Injectable()
export class ProfileService {

    isFriend(myID:number, friendID:number):boolean //todo: Implement this.
    {
        return (true);
    }

    getPrivateProfile()
    {
        return "This is your privater profile. But cookies are not implemented yet";
    }

    getFriendProfileByID(userID:number)
    {
        if (true)
        {
            if (this.isFriend(userID, 0))
            {
                return "This is friend profile with ID " + userID + ". But cookies are not implemented yet";
            }
            else
            {
                return (-1);
            }
        }
        return (-2);
    }

    getPublicProfileByID(userID:number)
    {
        if (true)
        {
            return "Public profile with ID " + userID
        }
        else
            return (-2);
    }

}