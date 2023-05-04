import { Injectable } from '@nestjs/common';
import { PublicProfile } from '../../interfaces/profile/public_profile.interface';
import { PrivateProfile } from 'src/users/interfaces/profile/private_profile.interface';
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

    async getPrivateProfile(myID:number)
    {
        const myProf = new PrivateProfile;
        const usrRet = await this.userRepository.findOne({where: { userID: myID}});
        myProf.userId = usrRet.userID;
        myProf.nickname = usrRet.username;
        myProf.status = usrRet.status;
        myProf.achievements = usrRet.achievementsCSV;
        myProf.avatar = usrRet.avatarPath;
        myProf.ladderLevel = usrRet.ladderLevel;
        myProf.losses = usrRet.losses;
        myProf.wins = usrRet.wins;
        return (myProf);
    }

    async getFriendProfileByID(friendID:number, myID:number)
    {
        if (true)
        {
            if (this.isFriend(friendID, myID))
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

    async getPublicProfileByID(userID:number)
    {
        if (true)
        {
            const publicProf = new PublicProfile;
            const usrRet = await this.userRepository.findOne({where: { userID: userID}});
            publicProf.userId = usrRet.userID;
            publicProf.nickname = usrRet.username;
            publicProf.achievements = usrRet.achievementsCSV;
            publicProf.avatar = usrRet.avatarPath;
            publicProf.ladderLevel = usrRet.ladderLevel;
            return (publicProf);
        }
        else
            return (-2);
    }

}