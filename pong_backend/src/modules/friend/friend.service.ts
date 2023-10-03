import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Friend } from 'src/models/orm_models/friend.entity';
import { Repository } from 'typeorm';
import { User } from 'src/models/orm_models/user.entity';
import { UserService } from '../user/userservice';
import { FriendDto } from './friendDto';
import {
  AuthProtector,
  UserAuthDTO,
} from '../authProtectorService/authProtector';
import { UserDTO } from '../user/userDTO';

export class FriendRepository extends Repository<Friend> {}

@Injectable()
export class FriendService {
  constructor(
    @InjectRepository(Friend)
    private readonly friendRepository: Repository<Friend>,
    private readonly userService: UserService,
    private readonly authProtector: AuthProtector,
  ) {}

  async findOne(id: number): Promise<Friend> {
    return this.friendRepository.findOneBy({ FId: id });
  }

  async remove(
    loggedUser: UserAuthDTO,
    userId: number,
    friendId: number,
  ): Promise<Friend> {
    if (parseInt(process.env.FEATURE_FLAG) === 1) {
      const authPass = await this.authProtector.protectorCheck(
        loggedUser.passwordHash,
        userId,
      );
      if (!authPass) {
        throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
      }
    }

    if (userId === friendId) {
      throw new HttpException('Cannot remove yourself', 400);
    }

    if (!userId || !friendId) {
      throw new HttpException('Invalid user ID or friend ID', 400);
    }

    const friend = await this.friendRepository.findOneBy({
      UserId: userId,
      FriendId: friendId,
    });

    if (!friend) {
      throw new HttpException('Friend not found', 404);
    }

    await this.friendRepository.delete(friend.FId);
    return friend;
  }

  async findUserFriends(
    loggedUser: UserAuthDTO,
    callerId: number,
  ): Promise<UserDTO[]> {
    if (parseInt(process.env.FEATURE_FLAG) === 1) {
      const authPass = await this.authProtector.protectorCheck(
        loggedUser.passwordHash,
        callerId,
      );
      if (!authPass) {
        throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
      }
    }

    const friends = await this.friendRepository.findBy({ UserId: callerId });

    const result = [];

    for (const friend of friends) {
      const user = await this.userService.findOne(friend.FriendId);
      const userDto = UserDTO.fromEntity(user);
      result.push(userDto);
    }

    return result;
  }

  async findFriendById(
    loggedUser: UserAuthDTO,
    callerId: number,
    targetId: number,
  ): Promise<UserDTO> {
    if (parseInt(process.env.FEATURE_FLAG) === 1) {
      const authPass = await this.authProtector.protectorCheck(
        loggedUser.passwordHash,
        callerId,
      );
      if (!authPass) {
        throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
      }
    }

    const friend = await this.friendRepository.findOneBy({
      UserId: callerId,
      FriendId: targetId,
    });

    if (!friend) {
      throw new HttpException('Friend not found', 404);
    }

    const result = await this.userService.findOne(friend.FriendId);

    return UserDTO.fromEntity(result);
  }

  async getFriendStatus(
    loggedUser: UserAuthDTO,
    callerId: number,
    targetId: number,
  ): Promise<string> {
    return (await this.findFriendById(loggedUser, callerId, targetId)).status;
  }

  async getFriendsStatuses(
    loggedUser: UserAuthDTO,
    userId: number,
  ): Promise<string[]> {
    if (parseInt(process.env.FEATURE_FLAG) === 1) {
      const authPass = await this.authProtector.protectorCheck(
        loggedUser.passwordHash,
        userId,
      );
      if (!authPass) {
        throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
      }
    }

    const result = [];
    const friends = await this.findUserFriends(loggedUser, userId);

    for (const friend of friends) {
      result.push(friend.status);
    }

    return result;
  }

  async addFriend(loggedUser: UserAuthDTO, dto: FriendDto): Promise<User> {
    if (parseInt(process.env.FEATURE_FLAG) === 1) {
      const authPass = await this.authProtector.protectorCheck(
        loggedUser.passwordHash,
        dto.UserId,
      );
      if (!authPass) {
        throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
      }
    }

    if (dto.UserId === dto.FriendId) {
      throw new HttpException('Cannot add yourself', 400);
    }

    const friend = await this.friendRepository.findOneBy({
      UserId: dto.UserId,
      FriendId: dto.FriendId,
    });

    if (friend) {
      throw new HttpException('Friend already exists', 400);
    }

    const newFriend = new Friend();
    newFriend.UserId = dto.UserId;
    newFriend.FriendId = dto.FriendId;
    this.friendRepository.save(newFriend);

    return this.userService.findOne(dto.FriendId);
  }

  async checkFriend(loggedUser: UserAuthDTO, callerId: number, targetId: number): Promise<string> {

    if(parseInt(process.env.FEATURE_FLAG) === 1) {
        const authPass  = await this.authProtector.protectorCheck(loggedUser.passwordHash, callerId);
        if (!authPass) {
            throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
        }
    }

    const friend = await this.friendRepository.findOneBy({
      UserId: callerId,
      FriendId: targetId,
    });

    if (!friend) {
      return "Not friend.";
    }

    return "Is a friend.";
  }
}
