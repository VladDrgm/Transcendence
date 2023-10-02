import { Controller, Post, Delete, Param, Body, Put } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { Friend } from 'src/models/orm_models/friend.entity';
import { FriendService } from './friend.service';
import { User } from 'src/models/orm_models/user.entity';
import { FriendDto } from './friendDto';
import { UserAuthDTO } from '../authProtectorService/authProtector';
import { UserDTO } from '../user/userDTO';

@ApiTags('Friend')
@Controller('friend')
export class FriendController {
  constructor(private readonly friendService: FriendService) {}

  @Put(':id/friends')
  @ApiOperation({ summary: 'Get all friends of a user' })
  async getUserFriends(
    @Param('id') id: number,
    @Body() loggedUser: UserAuthDTO,
  ): Promise<UserDTO[]> {
    const friends = await this.friendService.findUserFriends(loggedUser, id);
    return friends;
  }

  @Put(':callerId/friend/:targetId')
  @ApiOperation({ summary: 'Get a friend of a user by his id' })
  @ApiParam({ name: 'callerId', description: 'User callerId' })
  @ApiParam({ name: 'targetId', description: 'Friend ID' })
  async getFriendById(
    @Param('callerId') callerId: number,
    @Param('targetId') targetId: number,
    @Body() loggedUser: UserAuthDTO,
  ): Promise<UserDTO> {
    const friend = await this.friendService.findFriendById(
      loggedUser,
      callerId,
      targetId,
    );
    return friend;
  }

  @Put(':callerId/friend/:targetId/status')
  @ApiOperation({ summary: 'Get the status of a friend of a user by his id' })
  @ApiParam({ name: 'callerId', description: 'User ID' })
  @ApiParam({ name: 'targetId', description: 'Friend ID' })
  async getFriendStatus(
    @Param('callerId') callerId: number,
    @Param('targetId') targetId: number,
    @Body() loggedUser: UserAuthDTO,
  ): Promise<string> {
    return this.friendService.getFriendStatus(loggedUser, callerId, targetId);
  }

  @Put(':id/friends/status')
  @ApiOperation({ summary: 'Get the statuses of all friends of a user' })
  @ApiParam({ name: 'id', description: 'User ID' })
  async getFriendsStatuses(
    @Param('id') id: number,
    @Body() loggedUser: UserAuthDTO,
  ): Promise<string[]> {
    return this.friendService.getFriendsStatuses(loggedUser, id);
  }

  @Delete(':callerId/friend/:targetId')
  @ApiOperation({ summary: 'Remove a friend from a user' })
  @ApiParam({ name: 'callerId', description: 'User ID' })
  @ApiParam({ name: 'targetId', description: 'Friend ID' })
  async remove(
    @Param('callerId') callerId: number,
    @Param('targetId') targetId: number,
    @Body() loggedUser: UserAuthDTO,
  ): Promise<Friend> {
    return await this.friendService.remove(loggedUser, callerId, targetId);
  }

  @Post(':callerId/friend/:targetId')
  @ApiOperation({ summary: 'Add a friend to a user' })
  @ApiParam({ name: 'callerId', description: 'User ID' })
  @ApiParam({ name: 'targetId', description: 'Friend ID' })
  async add(
    @Param('callerId') callerId: number,
    @Param('targetId') targetId: number,
    @Body() loggedUser: UserAuthDTO,
  ): Promise<User> {
    const dto: FriendDto = { UserId: callerId, FriendId: targetId };
    return await this.friendService.addFriend(loggedUser, dto);
  }
}
