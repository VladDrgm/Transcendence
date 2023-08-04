import { Controller, Get, Post, Delete, Param } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { Friend } from 'src/models/orm_models/friend.entity';
import { FriendService } from './friend.service';
import { User } from 'src/models/orm_models/user.entity';
import { FriendDto } from './friendDto';

@ApiTags('Friend')
@Controller('friend')
export class FriendController {
  constructor(private readonly friendService: FriendService) {}

  @Get(':id/friends')
  @ApiOperation({ summary: 'Get all friends of a user' })
  async getUserFriends(@Param('id') id: number): Promise<User[]> {
    const friends = await this.friendService.findUserFriends(id);
    return friends;
  }

  @Get(':id/friend/:friendId')
  @ApiOperation({ summary: 'Get a friend of a user by his id' })
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiParam({ name: 'friendId', description: 'Friend ID' })
  async getFriendById(
    @Param('id') id: number,
    @Param('friendId') friendId: number,
  ): Promise<User> {
    const friend = await this.friendService.findFriendById(id, friendId);
    return friend;
  }

  @Get(':id/friend/:friendId/status')
  @ApiOperation({ summary: 'Get the status of a friend of a user by his id' })
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiParam({ name: 'friendId', description: 'Friend ID' })
  async getFriendStatus(
    @Param('id') id: number,
    @Param('friendId') friendId: number,
  ): Promise<string> {
    return this.friendService.getFriendStatus(id, friendId);
  }

  @Get(':id/friends/status')
  @ApiOperation({ summary: 'Get the statuses of all friends of a user' })
  @ApiParam({ name: 'id', description: 'User ID' })
  async getFriendsStatuses(@Param('id') id: number): Promise<string[]> {
    return this.friendService.getFriendsStatuses(id);
  }

  @Delete(':userId/friend/:friendId')
  @ApiOperation({ summary: 'Remove a friend from a user' })
  @ApiParam({ name: 'userId', description: 'User ID' })
  @ApiParam({ name: 'friendId', description: 'Friend ID' })
  async remove(
    @Param('userId') userId: number,
    @Param('friendId') friendId: number,
  ): Promise<Friend> {
    return await this.friendService.remove(userId, friendId);
  }

  @Post(':userId/friend/:friendId')
  @ApiOperation({ summary: 'Add a friend to a user' })
  @ApiParam({ name: 'userId', description: 'User ID' })
  @ApiParam({ name: 'friendId', description: 'Friend ID' })
  async add(
    @Param('userId') userId: number,
    @Param('friendId') friendId: number,
  ): Promise<User> {
    const dto: FriendDto = { UserId: userId, FriendId: friendId };
    return await this.friendService.addFriend(dto);
  }
}
