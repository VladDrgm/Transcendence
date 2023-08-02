import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Friend } from 'src/models/orm_models/friend.entity';
import { In, Repository } from 'typeorm';
import { User } from 'src/models/orm_models/user.entity';
import { UserService } from '../user/userservice';
import { FriendDto } from './friendDto';

export class FriendRepository extends Repository<Friend> {}

@Injectable()
export class FriendService {
  constructor(
    @InjectRepository(Friend)
    private readonly friendRepository: Repository<Friend>,
    private readonly userService: UserService,
  ) {}

  async findOne(id: number): Promise<Friend> {
    return this.friendRepository.findOneBy({ FId: id });
  }

  async remove(userId: number, friendId: number): Promise<Friend> {
    if (userId === friendId) {
      throw new HttpException('Cannot remove yourself', 400);
    }

    if (!userId || !friendId) {
      throw new HttpException('Invalid user ID or friend ID', 400);
    }

    const friend = await this.friendRepository.findOneBy({ UserId: userId, FriendId: friendId });

    if (!friend) {
      throw new HttpException('Friend not found', 404);
    }

    await this.friendRepository.delete(friend.FId);
    return friend;
  }

  async findUserFriends(userId: number): Promise<User[]> {
    const friends = await this.friendRepository.findBy({ UserId: userId });

	if (!friends || friends.length == 0) {
		throw new HttpException('Friends not found', 404);
	}

	const result = [];

	for (const friend of friends) {
		result.push(await this.userService.findOne(friend.FriendId));
	}

    return result;
  }

  async findFriendById(userId: number, friendId: number): Promise<User> {
    const friend = await this.friendRepository.findOneBy({ UserId: userId, FriendId: friendId });

	if (!friend) {
		throw new HttpException('Friend not found', 404);
	}

	const result = await this.userService.findOne(friend.FriendId);

    return result;
  }

  async getFriendStatus(userId: number, friendId: number): Promise<string> {
    return (await this.findFriendById(userId, friendId)).status;
  }

  async getFriendsStatuses(userId: number): Promise<string[]> {
    const result = [];
    const friends = await this.findUserFriends(userId);

    for (const friend of friends) {
      result.push(friend.status);
    }

    return result;
  }

  async addFriend(dto : FriendDto): Promise<User> {
	
	if (dto.UserId === dto.FriendId) {
		throw new HttpException('Cannot add yourself', 400);
	}

	const friend = await this.friendRepository.findOneBy({ UserId: dto.UserId, FriendId: dto.FriendId });

	if (friend) {
		throw new HttpException('Friend already exists', 400);
	}

	const newFriend = new Friend();
	newFriend.UserId = dto.UserId;
	newFriend.FriendId = dto.FriendId;

	return this.userService.findOne(dto.FriendId);
  }
}
