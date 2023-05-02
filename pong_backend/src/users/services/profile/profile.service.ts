import { Injectable } from '@nestjs/common';
import { PublicProfile } from '../../interfaces/profile/public_profile.interface';
import { FriendProfile } from '../../interfaces/profile/friend_profile.interface';
import { User, StatusValue } from 'src/models/orm_models/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';


@Injectable()
export class ProfileService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>
    ){}

    isFriend(myID:number, friendID:number):boolean //todo: Implement this.
    {
        return (true);
    }

    getPrivateProfile()
    {
        return "This is your privater profile. But cookies are not implemented yet";
    }

    async getFriendProfileByID(friendID:number)
    {
        if (true)
        {
            if (true)
            {
                const friendProf = new FriendProfile;
                const usrRet = await this.userRepository.findOne({where: { userID: friendID}});
                friendProf.userId = usrRet.userID;
                friendProf.nickname = usrRet.username;
                friendProf.status = usrRet.status;
                friendProf.achievements = usrRet.achievementsCSV;
                friendProf.avatar = usrRet.avatarPath;
                friendProf.ladderLevel = usrRet.ladderLevel;
                friendProf.losses = usrRet.losses;
                friendProf.wins = usrRet.wins;
                return (friendProf);
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