import {
  Controller,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UsePipes,
  ValidationPipe,
  Query,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { Channel } from 'src/models/orm_models/channel.entity';
import { ChannelService } from './channel.service';
import { ChannelAdmin } from 'src/models/orm_models/channel_admin.entity';
import { ChannelUser } from 'src/models/orm_models/channel_user.entity';
import { ChannelBlockedUser } from 'src/models/orm_models/channel_blocked_user.entity';
import { UserAuthDTO } from '../authProtectorService/authProtector';

@ApiTags('Channel')
@Controller('channel')
export class ChannelController {
  constructor(private readonly channelService: ChannelService) {}

  @Put()
  @ApiOperation({ summary: 'Get all Channels' })
  async findAll(): Promise<Channel[]> {
    return this.channelService.findAll();
  }

  @Put(':id')
  @ApiOperation({ summary: 'Get a Channel by its ID' })
  async findOne(@Param('id') id: number): Promise<Channel> {
    return this.channelService.findOne(id);
  }

  @Post(':callerId/:ownerId/:channelName/:channelType/')
  @ApiOperation({
    summary: 'Create a Channel',
    description:
      'The channel will be created if you send a json body with the request',
  })
  @UsePipes(new ValidationPipe())
  async create(
    @Param('callerId') callerId: number,
    @Param('ownerId') ownerId: number,
    @Param('channelName') channelName: string,
    @Param('channelType') channelType: string,
    @Body() loggedInUser: UserAuthDTO,
    @Query('channelPassword') channelPassword?: string,
  ): Promise<Channel> {
    return this.channelService.create(
      loggedInUser,
      callerId,
      ownerId,
      channelName,
      channelType,
      channelPassword,
    );
  }

  @Delete(':callerId/:channelId')
  @ApiOperation({ summary: 'Delete a Channel by its ID' })
  async remove(
    @Param('channelId') chanId: number,
    @Param('callerId') callerId: number,
    @Body() loggedUser: UserAuthDTO,
  ): Promise<void> {
    if (isNaN(chanId) || isNaN(callerId)) {
      throw new HttpException(
        'Invalid channelId or callerId',
        HttpStatus.BAD_REQUEST,
      );
    }

    await this.channelService.remove(loggedUser, callerId, chanId);
  }

  @Post('admin/add/:callerId/:targetId/:channelId')
  @ApiOperation({
    summary: 'Add an Admin by his userId. Only Owner can add an Admin.',
  })
  async addChannelAdmin(
    @Param('callerId') callerId: number,
    @Param('targetId') targetId: number,
    @Param('channelId') channelId: number,
    @Body() loggedUser: UserAuthDTO,
  ): Promise<ChannelAdmin> {
    return this.channelService.addAdmin(
      loggedUser,
      callerId,
      targetId,
      channelId,
    );
  }

  @Put(':channelId/admins')
  @ApiOperation({ summary: 'Get all Admins of a Channel' })
  async getChannelAdmins(
    @Param('channelId') channelId: number,
  ): Promise<ChannelAdmin[]> {
    return this.channelService.getChannelAdmins(channelId);
  }

  @Put(':userId/:channelId/admin')
  @ApiOperation({ summary: 'Get an Admin by his userId' })
  @ApiParam({ name: 'userId', description: 'User ID' })
  @ApiParam({ name: 'channelId', description: 'Channel ID' })
  async getChannelAdmin(
    @Param('userId') userId: number,
    @Param('channelId') channelId: number,
  ): Promise<ChannelAdmin> {
    if (Number.isNaN(userId)) {
      // Throw an exception indicating that the user is not logged in or unauthorized
      throw new HttpException(
        'User is not logged in or unauthorized',
        HttpStatus.UNAUTHORIZED,
      );
    }
    return this.channelService.getChannelAdminByUserId(userId, channelId);
  }

  @Delete(':userId/:targetId/:channelId/admin')
  @ApiOperation({
    summary:
      'Delete an Admin by his userId. Only Owner can delete an Admin. The checks are made in the service method. ',
  })
  @ApiParam({ name: 'userId', description: 'Caller ID' })
  @ApiParam({ name: 'targetId', description: 'Target ID' })
  @ApiParam({ name: 'channelId', description: 'Channel ID' })
  async removeChannelAdmin(
    @Param('userId') userId: number,
    @Param('targetId') targetId: number,
    @Param('channelId') channelId: number,
    @Body() loggedUser: UserAuthDTO,
  ): Promise<void> {
    await this.channelService.removeChannelAdmin(
      loggedUser,
      userId,
      targetId,
      channelId,
    );
  }

  @Post(':callerId/:targetId/:channelId/user')
  @ApiOperation({
    summary: 'Add a User by his userId. Only Admins can add a User.',
  })
  async addChannelUser(
    @Param('callerId') callerId: number,
    @Param('targetId') targetId: number,
    @Param('channelId') channelId: number,
    @Body() loggedUser: UserAuthDTO,
  ): Promise<ChannelUser> {
    return this.channelService.addChannelUser(
      loggedUser,
      callerId,
      targetId,
      channelId,
    );
  }

  @Put(':channelId/users')
  @ApiOperation({ summary: 'Get all Users of a Channel' })
  async getChannelUsers(
    @Param('channelId') channelId: number,
  ): Promise<ChannelUser[]> {
    return this.channelService.getChannelUsers(channelId);
  }

  @Put(':channelId/mutedusers')
  @ApiOperation({ summary: 'Get all muted users of a Channel' })
  async getChannelMutedUsers(
    @Param('channelId') channelId: number,
  ): Promise<ChannelUser[]> {
    return this.channelService.getChannelUsersOnMute(channelId);
  }

  @Put(':callerId/:userId/:channelId/user')
  @ApiOperation({ summary: 'Get a ChannelUser by his userId' })
  async getChannelUserByUserId(
    @Param('callerId') callerId: number,
    @Param('userId') userId: number,
    @Param('channelId') channelId: number,
    @Body() loggedUser: UserAuthDTO,
  ): Promise<ChannelUser> {
    return this.channelService.getChannelUserByUserId(
      loggedUser,
      callerId,
      userId,
      channelId,
    );
  }

  @Delete(':callerId/:targetId/:channelId/user')
  @ApiOperation({
    summary:
      'Delete a User by his userId. Only Admins and the user itself can delete the User.',
  })
  async removeChannelUser(
    @Param('callerId') callerId: number,
    @Param('targetId') targetId: number,
    @Param('channelId') channelId: number,
    @Body() loggedUser: UserAuthDTO,
  ): Promise<void> {
    return await this.channelService.removeChannelUser(
      callerId,
      targetId,
      channelId,
      loggedUser,
    );
  }

  @Post('ban/blocked/:callerId/:targetId/:channelId/blocked')
  @ApiOperation({
    summary: 'Ban a user from a Channel. Only Admins/Owner can ban users.',
  })
  async addChannelBlockedUser(
    @Param('callerId') callerId: number,
    @Param('targetId') targetId: number,
    @Param('channelId') channelId: number,
    @Body() loggedUser: UserAuthDTO,
  ): Promise<ChannelBlockedUser> {
    return await this.channelService.addChannelBlockedUserService(
      loggedUser,
      callerId,
      targetId,
      channelId,
    );
  }

  @Put(':channelId/blockedUsers')
  @ApiOperation({ summary: 'Get all blocked users of a Channel' })
  async getChannelBlockedUsers(
    @Param('channelId') channelId: number,
  ): Promise<ChannelBlockedUser[]> {
    return await this.channelService.getChannelBlockedUsers(channelId);
  }

  @Put(':callerId/:targetId/:channelId/blocked')
  @ApiOperation({ summary: 'Get a ChannelBlockedUser by his userId' })
  async getChannelBlockedUserByUserId(
    @Param('callerId') callerId: number,
    @Param('targetId') targetId: number,
    @Param('channelId') channelId: number,
    @Body() loggedUser: UserAuthDTO,
  ): Promise<boolean> {
    const result = await this.channelService.getChannelBlockedUserByUserId(
      loggedUser,
      callerId,
      targetId,
      channelId,
    );
    if (result) return true;
    return false;
  }

  @Delete(':callerId/:targetId/:channelId/blocked')
  @ApiOperation({
    summary: 'Unban a user from a Channel. Only Admins/Owner can unban users.',
  })
  async removeChannelBlockedUser(
    @Param('callerId') callerId: number,
    @Param('targetId') targetId: number,
    @Param('channelId') channelId: number,
    @Body() loggedUser: UserAuthDTO,
  ): Promise<void> {
    await this.channelService.removeChannelBlockedUser(
      loggedUser,
      callerId,
      targetId,
      channelId,
    );
  }

  @Put(':callerId/:channelId/type')
  @ApiOperation({
    summary:
      'Change the type of a channel to public/private. Only Owner can change the type of a channel.',
  })
  async changeChannelType(
    @Param('callerId') callerId: number,
    @Param('channelId') channelId: number,
    @Body() loggedUser: UserAuthDTO,
  ): Promise<void> {
    await this.channelService.changeChannelType(
      loggedUser,
      callerId,
      channelId,
    );
  }

  @Delete(':callerId/:channelId/password')
  @ApiOperation({
    summary: 'Delete a channel password.',
  })
  async deleteChannelPassword(
    @Param('callerId') callerId: number,
    @Param('channelId') channelId: number,
    @Body() loggedUser: UserAuthDTO,
  ): Promise<void> {
    await this.channelService.deleteChannelPassword(
      loggedUser,
      callerId,
      channelId,
    );
  }

  @Put(':callerId/:channelId/:password/password')
  @ApiOperation({
    summary:
      'Change the password of a channel. Only Owner can change the password of a channel.',
  })
  async changeChannelPassword(
    @Param('callerId') callerId: number,
    @Param('channelId') channelId: number,
    @Param('password') password: string,
    @Body() loggedUser: UserAuthDTO,
  ): Promise<void> {
    await this.channelService.changeChannelPassword(
      loggedUser,
      callerId,
      channelId,
      password,
    );
  }

  @Post(':callerId/:targetId/:channelId/:password/password')
  @ApiOperation({
    summary: 'Add an user to a  private channel.',
  })
  async addUserToPrivateChannel(
    @Param('callerId') callerId: number,
    @Param('targetId') targetId: number,
    @Param('channelId') channelId: number,
    @Param('password') password: string,
    @Body() loggedUser: UserAuthDTO,
  ): Promise<void> {
    return this.channelService.addUserToPrivateChannel(
      loggedUser,
      callerId,
      targetId,
      channelId,
      password,
    );
  }

  @Post(':callerId/:targetId/:channelId/mute/:duration') // add here
  @ApiOperation({
    summary:
      'Mute a user in the channel for a specified duration (in minutes). Only admins can mute users.',
  })
  async muteUserForDuration(
    @Param('callerId') callerId: number,
    @Param('targetId') targetId: number,
    @Param('channelId') channelId: number,
    @Param('duration') duration: number,
    @Body() loggedUser: UserAuthDTO,
  ): Promise<void> {
    await this.channelService.muteUserForDuration(
      loggedUser,
      callerId,
      targetId,
      channelId,
      duration,
    );
  }

  @Put(':channelId/owner')
  @ApiOperation({ summary: 'Get the owner of a channel' })
  async getChannelOwner(
    @Param('channelId') channelId: number,
  ): Promise<ChannelAdmin> {
    return this.channelService.getChannelOwner(channelId);
  }

  @Put(':userId/:channelId/owner')
  @ApiOperation({ summary: 'Change the owner of a channel' })
  async changeChannelOwner(
    @Param('userId') userId: number,
    @Param('channelId') channelId: number,
  ): Promise<void> {
    await this.channelService.changeChannelOwner(userId, channelId);
  }

  @Delete(':channelId/owner')
  @ApiOperation({ summary: 'Delete the owner of a channel' })
  async deleteChannelOwner(
    @Param('channelId') channelId: number,
  ): Promise<void> {
    await this.channelService.deleteChannelOwner(channelId);
  }

  @Put(':callerId/:targetId/:channelId/mute')
  @ApiOperation({ summary: 'Get the mute status of a user in a channel' })
  async getMuteStatus(
    @Param('callerId') callerId: number,
    @Param('targetId') targetId: number,
    @Param('channelId') channelId: number,
    @Body() loggedUser: UserAuthDTO,
  ): Promise<boolean> {
    return this.channelService.getMutedStatus(
      loggedUser,
      callerId,
      targetId,
      channelId,
    );
  }

  @Post(':callerId/:channelId') //add here
  @ApiOperation({ summary: 'Join a public channel as a user' })
  async postChannelUserInPublicChannel(
    @Param('callerId') callerId: number,
    @Param('channelId') channelId: number,
    @Body() loggedUser: UserAuthDTO,
  ): Promise<void> {
    await this.channelService.createPublicChannelUser(
      loggedUser,
      callerId,
      channelId,
    );
  }
}
