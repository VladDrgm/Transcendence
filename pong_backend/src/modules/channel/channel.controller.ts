import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
} from '@nestjs/common';
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { Channel } from 'src/models/orm_models/channel.entity';
import { ChannelService } from './channel.service';
import { ApiBody } from '@nestjs/swagger';
import { ChannelAdmin } from 'src/models/orm_models/channel_admin.entity';
import { channel } from 'diagnostics_channel';
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

  @Post()
  @ApiOperation({
    summary: 'Create a Channel',
    description:
      'The channel will be created if you send a json body with the request',
  })
  async create(@Body() channel: CreateChannelDto): Promise<Channel> {
    return this.channelService.create(channel);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a Channel by its ID' })
  async remove(@Param('id') id: number): Promise<void> {
    await this.channelService.remove(id);
  }

  @Post(':userId/:targetId/:channelId/admin')
  @ApiOperation({
    summary: 'Add an Admin by his userId. Only Owner can add an Admin.',
  })
  async addChannelAdmin(
    @Param('userId') userId: number,
    @Param('targetId') targetId: number,
    @Param('channelId') channelId: number,
  ): Promise<ChannelAdmin> {
    return this.channelService.addAdmin(userId, targetId, channelId);
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

  @Post(':userId/:channelId/user')
  @ApiOperation({
    summary: 'Add a User by his userId. Only Admins can add a User.',
  })
  async addChannelUser(
    @Param('userId') userId: number,
    @Param('channelId') channelId: number,
  ): Promise<ChannelUser> {
    return this.channelService.addChannelUser(userId, channelId);
  }

  @Get(':channelId/users')
  @ApiOperation({ summary: 'Get all Users of a Channel' })
  async getChannelUsers(
    @Param('channelId') channelId: number,
  ): Promise<ChannelUser[]> {
    return this.channelService.getChannelUsers(channelId);
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
    @Param('userId') userId: number,
    @Param('channelId') channelId: number,
  ): Promise<void> {
    await this.channelService.removeChannelUser(userId, channelId);
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
}
