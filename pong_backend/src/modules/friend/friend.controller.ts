import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Friend } from 'src/models/orm_models/friend.entity';
import { FriendService } from './friend.service';
import { User } from 'src/models/orm_models/user.entity';


@ApiTags('Friend')
@Controller('friend')
export class FriendController {
  constructor(private readonly friendService: FriendService) {}

  @Get()
  async findAll(): Promise<Friend[]> {
    return this.friendService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<Friend> {
    return this.friendService.findOne(id);
  }


  @Get(':id/friends')
  async getUserFriends(@Param('id') id: number): Promise<Friend[]> {

	const friends = await this.friendService.findUserFriends(id);
	return friends;
  }

  @Get(':id/friend/:friendId')
  async getFriendById(@Param('id') id: number, @Param('friendId') friendId: number): Promise<User> {

	const friend = await this.friendService.findFriendById(id, friendId);

	return friend;
  }

  @Get(':id/friend/:friendId/status')
  async getFriendStatus(@Param('id') id: number, @Param('friendId') friendId: number): Promise<string> {

	return this.friendService.getFriendStatus(id, friendId);
	}

  @Get(':id/friends/status')
  async getFriendsStatuses(@Param('id') id: number): Promise<string[]> {

	return this.friendService.getFriendsStatuses(id);
  }
	
//   @Delete(':id')
//   async remove(@Param('id') id: number): Promise<void> {
//     await this.channelService.remove(id);
//   }
}
