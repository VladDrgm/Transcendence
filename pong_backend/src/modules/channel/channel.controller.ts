import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { Channel } from 'src/models/orm_models/channel.entity';
import { ChannelService } from './channel.service';
import { ChannelAdmin } from 'src/models/orm_models/channel_admin.entity';
import { ChannelUser } from 'src/models/orm_models/channel_user.entity';
import { ChannelBlockedUser } from 'src/models/orm_models/channel_blocked_user.entity';
import { CreateChannelDto } from './channelDTO';

@ApiTags('Channel')
@Controller('channel')
export class ChannelController {
  constructor(private readonly channelService: ChannelService) {}

  @Get()
  @ApiOperation({ summary: 'Get all Channels' })
  async findAll(): Promise<Channel[]> {
    return this.channelService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a Channel by its ID' })
  async findOne(@Param('id') id: number): Promise<Channel> {
    return this.channelService.findOne(id);
  }

  @Post(':callerId')
  @ApiOperation({
    summary: 'Create a Channel',
    description:
      'The channel will be created if you send a json body with the request',
  })
  @UsePipes(new ValidationPipe())
  async create(
    @Body() channel: CreateChannelDto,
    @Param('callerId') callerId: number,
  ): Promise<Channel> {
    return this.channelService.create(channel, callerId);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a Channel by its ID' })
  async remove(@Param('id') id: number): Promise<void> {
    await this.channelService.remove(id);
  }

  @Post(':callerId/:targetId/:channelId')
  @ApiOperation({
    summary: 'Add an Admin by his userId. Only Owner can add an Admin.',
  })
  async addChannelAdmin(
    @Param('callerId') callerId: number,
    @Param('targetId') targetId: number,
    @Param('channelId') channelId: number,
  ): Promise<ChannelAdmin> {
    return this.channelService.addAdmin(callerId, targetId, channelId);
  }

  @Get(':channelId/admins')
  @ApiOperation({ summary: 'Get all Admins of a Channel' })
  async getChannelAdmins(
    @Param('channelId') channelId: number,
  ): Promise<ChannelAdmin[]> {
    return this.channelService.getChannelAdmins(channelId);
  }

  @Get(':userId/:channelId/admin')
  @ApiOperation({ summary: 'Get an Admin by his userId' })
  @ApiParam({ name: 'userId', description: 'User ID' })
  @ApiParam({ name: 'channelId', description: 'Channel ID' })
  async getChannelAdmin(
    @Param('userId') userId: number,
    @Param('channelId') channelId: number,
  ): Promise<ChannelAdmin> {
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
  ): Promise<void> {
    await this.channelService.removeChannelAdmin(userId, targetId, channelId);
  }

  @Post(':callerId/:targetId/:channelId/user')
  @ApiOperation({
    summary: 'Add a User by his userId. Only Admins can add a User.',
  })
  async addChannelUser(
    @Param('callerId') callerId: number,
    @Param('targetId') targetId: number,
    @Param('channelId') channelId: number,
  ): Promise<ChannelUser> {
    return this.channelService.addChannelUser(callerId, targetId, channelId);
  }

  @Get(':channelId/users')
  @ApiOperation({ summary: 'Get all Users of a Channel' })
  async getChannelUsers(
    @Param('channelId') channelId: number,
  ): Promise<ChannelUser[]> {
    return this.channelService.getChannelUsers(channelId);
  }

  @Get(':channelId/mutedusers')
  @ApiOperation({ summary: 'Get all muted users of a Channel' })
  async getChannelMutedUsers(
    @Param('channelId') channelId: number,
  ): Promise<ChannelUser[]> {
    return this.channelService.getChannelUsersOnMute(channelId);
  }

  @Get(':userId/:channelId/user')
  @ApiOperation({ summary: 'Get a ChannelUser by his userId' })
  async getChannelUserByUserId(
    @Param('userId') userId: number,
    @Param('channelId') channelId: number,
  ): Promise<ChannelUser> {
    return this.channelService.getChannelUserByUserId(userId, channelId);
  }

  @Delete(':userId/:channelId/user')
  @ApiOperation({
    summary: 'Delete a User by his userId. Only Admins can delete a User.',
  })
  async removeChannelUser(
    @Param('callerId') callerId: number,
    @Param('targetId') targetId: number,
    @Param('channelId') channelId: number,
  ): Promise<void> {
    await this.channelService.removeChannelUser(callerId, targetId, channelId);
  }

  @Post(':userId/:channelId/blocked')
  @ApiOperation({
    summary: 'Ban a user from a Channel. Only Admins/Owner can ban users.',
  })
  async addChannelBlockedUser(
    @Param('userId') userId: number,
    @Param('channelId') channelId: number,
  ): Promise<ChannelBlockedUser> {
    return this.channelService.addChannelBlockedUser(userId, channelId);
  }

  @Get(':channelId/blockedUsers')
  @ApiOperation({ summary: 'Get all blocked users of a Channel' })
  async getChannelBlockedUsers(
    @Param('channelId') channelId: number,
  ): Promise<ChannelBlockedUser[]> {
    return this.channelService.getChannelBlockedUsers(channelId);
  }

  @Get(':userId/:channelId/blocked')
  @ApiOperation({ summary: 'Get a ChannelBlockedUser by his userId' })
  async getChannelBlockedUserByUserId(
    @Param('userId') userId: number,
    @Param('channelId') channelId: number,
  ): Promise<ChannelBlockedUser> {
    return this.channelService.getChannelBlockedUserByUserId(userId, channelId);
  }

  @Delete(':userId/:channelId/blocked')
  @ApiOperation({
    summary: 'Unban a user from a Channel. Only Admins/Owner can unban users.',
  })
  async removeChannelBlockedUser(
    @Param('userId') userId: number,
    @Param('channelId') channelId: number,
  ): Promise<void> {
    await this.channelService.removeChannelBlockedUser(userId, channelId);
  }

  @Put(':userId/:channelId/type')
  @ApiOperation({
    summary:
      'Change the type of a channel to public/private. Only Owner can change the type of a channel.',
  })
  async changeChannelType(
    @Param('userId') userId: number,
    @Param('channelId') channelId: number,
  ): Promise<void> {
    await this.channelService.changeChannelType(userId, channelId);
  }

  @Delete(':userId/:channelId/password')
  @ApiOperation({
    summary: 'Delete a channel password.',
  })
  async deleteChannelPassword(
    @Param('userId') userId: number,
    @Param('channelId') channelId: number,
  ): Promise<void> {
    await this.channelService.deleteChannelPassword(userId, channelId);
  }

  @Put(':userId/:channelId/:password/password')
  @ApiOperation({
    summary:
      'Change the password of a channel. Only Owner can change the password of a channel.',
  })
  async changeChannelPassword(
    @Param('userId') userId: number,
    @Param('channelId') channelId: number,
    @Param('password') password: string,
  ): Promise<void> {
    await this.channelService.changeChannelPassword(
      userId,
      channelId,
      password,
    );
  }

  @Post(':userId/:channelId/:password/password')
  @ApiOperation({
    summary: 'Add an user to a  private channel.',
  })
  async addUserToPrivateChannel(
    @Param('userId') userId: number,
    @Param('channelId') channelId: number,
    @Param('password') password: string,
  ): Promise<void> {
    return this.channelService.addUserToPrivateChannel(
      userId,
      channelId,
      password,
    );
  }

  @Post(':callerId/:targetId/:channelId/mute/:duration')
  @ApiOperation({
    summary:
      'Mute a user in the channel for a specified duration (in minutes). Only admins can mute users.',
  })
  async muteUserForDuration(
    @Param('callerId') callerId: number,
    @Param('targetId') targetId: number,
    @Param('channelId') channelId: number,
    @Param('duration') duration: number,
  ): Promise<void> {
    await this.channelService.muteUserForDuration(
      callerId,
      targetId,
      channelId,
      duration,
    );
  }

  @Get(':channelId/owner')
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

  @Get(':callerId/:targetId/:channelId/mute')
  @ApiOperation({ summary: 'Get the mute status of a user in a channel' })
  async getMuteStatus(
    @Param('callerId') callerId: number,
    @Param('targetId') targetId: number,
    @Param('channelId') channelId: number,
  ): Promise<boolean> {
    return this.channelService.getMutedStatus(callerId, targetId, channelId);
  }

  @Post(':callerId/:channelId')
  @ApiOperation({ summary: 'Join a public channel as a user' })
  async postChannelUserInPublicChannel(
    @Param('callerId') callerId: number,
    @Param('channelId') channelId: number,
  ): Promise<void> {
    await this.channelService.createPublicChannelUser(callerId, channelId);
  }
}
