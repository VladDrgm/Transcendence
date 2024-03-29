import { Injectable } from '@nestjs/common';
import { FriendProfile } from './interfaces/IFriendProfile';
import { User } from 'src/models/orm_models/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PrivateProfile } from './interfaces/IPrivateProfile';
import { PublicProfile } from './interfaces/IPublicProfile';

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  isFriend(myID: number, friendID: number): boolean {
    //todo: Implement this.
    return true;
  }

  async getPrivateProfile(myID: number) {
    const myProf = new PrivateProfile();
    const usrRet = await this.userRepository.findOne({
      where: { userID: myID },
    });
    myProf.userId = usrRet.userID;
    myProf.nickname = usrRet.username;
    myProf.status = usrRet.status;
    myProf.achievements = usrRet.achievementsCSV;
    myProf.avatar = usrRet.avatarPath;
    myProf.points = usrRet.points;
    myProf.losses = usrRet.losses;
    myProf.wins = usrRet.wins;
    return myProf;
  }

  async getFriendProfileByID(friendID: number, myID: number) {
    if (true) {
      if (this.isFriend(friendID, myID)) {
        const friendProf = new FriendProfile();
        const usrRet = await this.userRepository.findOne({
          where: { userID: friendID },
        });
        friendProf.userId = usrRet.userID;
        friendProf.nickname = usrRet.username;
        friendProf.status = usrRet.status;
        friendProf.achievements = usrRet.achievementsCSV;
        friendProf.avatar = usrRet.avatarPath;
        friendProf.points = usrRet.points;
        friendProf.losses = usrRet.losses;
        friendProf.wins = usrRet.wins;
        return friendProf;
      } else {
        return -1;
      }
    }
    return -2;
  }

  async getPublicProfileByID(userID: number) {
    if (true) {
      const publicProf = new PublicProfile();
      const usrRet = await this.userRepository.findOne({
        where: { userID: userID },
      });
      publicProf.userId = usrRet.userID;
      publicProf.nickname = usrRet.username;
      publicProf.achievements = usrRet.achievementsCSV;
      publicProf.avatar = usrRet.avatarPath;
      publicProf.points = usrRet.points;
      return publicProf;
    } else return -2;
  }
}
