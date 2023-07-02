// import {
//   Controller,
//   Get,
//   Post,
//   Put,
//   Delete,
//   Body,
//   Param,
// } from '@nestjs/common';
// import { ApiTags } from '@nestjs/swagger';
// import { Friend } from 'src/models/orm_models/friend.entity';
// import { FriendService } from './friend.service';
// import { User } from 'src/models/orm_models/user.entity';


// @ApiTags('Friend')
// @Controller('friend')
// export class FriendController {
//   constructor(private readonly friendService: FriendService) {}

//   @Get()
//   async findAll(): Promise<Friend[]> {
//     return this.friendService.findAll();
//   }

//   @Get(':id')
//   async findOne(@Param('id') id: number): Promise<Friend> {
//     return this.friendService.findOne(id);
//   }


//   @Get(':id/friends')
//   async getUserFriends(@Param('id') id: number): Promise<Friend[]> {

// 	const friends = await this.friendService.findUserFriends(id);
// 	return friends;
//   }

//   @Get(':id/friend/:friendId')
//   async getFriendById(@Param('id') id: number, @Param('friendId') friendId: number): Promise<User> {

// 	const friend = await this.friendService.findFriendById(id, friendId);

// 	return friend;
//   }

//   @Get(':id/friend/:friendId/status')
//   async getFriendStatus(@Param('id') id: number, @Param('friendId') friendId: number): Promise<string> {

// 	return this.friendService.getFriendStatus(id, friendId);
// 	}

//   @Get(':id/friends/status')
//   async getFriendsStatuses(@Param('id') id: number): Promise<string[]> {

// 	return this.friendService.getFriendsStatuses(id);
//   }
	
//   @Delete(':id')
//   async remove(@Param('id') id: number): Promise<void> {
//     await this.channelService.remove(id);
//   }
// }

// build me the same code, but for blocked users

import {
	  Controller,
	  Get,
	  Post,
	  Put,
	  Delete,
	  Body,
	  Param,
} from '@nestjs/common';

import { ApiTags, ApiOperation, ApiParam } from '@nestjs/swagger';
import { User } from 'src/models/orm_models/user.entity';
import { BlockedService } from './blocked.service';
import { Blocked } from 'src/models/orm_models/blocked.entity';
import { CreateBlockedDto } from './blockedDTO';

@ApiTags('Blocked')
@Controller('blocked')
export class BlockedController {
  constructor(private readonly blockedService: BlockedService) {}

  @Get(':requesterId')
  @ApiOperation({ summary: 'Get all the blocked users for the requester' })
  @ApiParam({ name: 'requesterId', description: 'Caller ID' })
  async getBlockedUserById(@Param('requesterId') requesterId: number): Promise<Blocked[]> {
	return this.blockedService.findAllBlockedForOneUser(requesterId);
  }

  @Post()
  @ApiOperation({ summary: 'Block a user' })
  @ApiParam({ name: 'requesterId', description: 'Caller ID', required: true, type: Number, example: 9})
  @ApiParam({ name: 'blockedId', description: 'User to block ID', required: true, type: Number, example: 1 })
  async blockUser(@Body() blocked: CreateBlockedDto): Promise<Blocked> {
	return this.blockedService.blockUser(blocked);
  }

  @Delete()
  @ApiOperation({ summary: 'Unblock a user' })
  @ApiParam({ name: 'requesterId', description: 'Caller ID', required: true, type: Number, example: 9})
  @ApiParam({ name: 'blockedId', description: 'User to unblock ID', required: true, type: Number, example: 1 })
  async unblockUser(@Body() blocked: CreateBlockedDto): Promise<string> {
	return await this.blockedService.unblockUser(blocked);
  }

  @Get(':requesterId/:blockedId')
  @ApiOperation({ summary: 'Check if a user is blocked and return the entity' })
  @ApiParam({ name: 'requesterId', description: 'Caller ID', required: true, type: Number, example: 9})
  @ApiParam({ name: 'blockedId', description: 'User to check ID', required: true, type: Number, example: 1 })
  async checkIfBlocked(@Param('requesterId') requesterId: number, @Param('blockedId') blockedId: number): Promise<Blocked> {
	return await this.blockedService.getOneBlockedUser(requesterId, blockedId);
  }
}