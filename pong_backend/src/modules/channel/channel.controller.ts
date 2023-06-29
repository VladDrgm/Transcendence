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
  async findAll(): Promise<Channel[]> {
    return this.channelService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<Channel> {
    return this.channelService.findOne(id);
  }

  @Post()
  async create(@Body() channel: CreateChannelDto): Promise<Channel> {
    return this.channelService.create(channel);
  }

  @Delete(':id')
  async remove(@Param('id') id: number): Promise<void> {
    await this.channelService.remove(id);
  }

  @Post(':userId/:targetId/:channelId/admin')
  async addChannelAdmin(@Param('userId') userId: number,@Param('targetId') targetId: number, @Param('channelId') channelId: number): Promise<ChannelAdmin>{
	return this.channelService.addAdmin(userId, targetId, channelId);
  }

  @Get(':channelId/admins')
  async getChannelAdmins(@Param('channelId') channelId: number): Promise<ChannelAdmin[]> {
	return this.channelService.getChannelAdmins(channelId);
  }

  @Get(':userId/:channelId/admin')
  async getChannelAdmin(@Param('userId') userId: number, @Param('channelId') channelId: number): Promise<ChannelAdmin> {
	return this.channelService.getChannelAdminByUserId(userId, channelId);
	  }

  @Delete(':userId/:targetId/:channelId/admin')
  @ApiOperation({ summary: 'Delete an Admin by his userId. Only Owner can delete an Admin. The checks are made in the service method. ' })
  @ApiParam({ name: 'userId', description: 'Caller ID' })
  @ApiParam({ name: 'targetId', description: 'Target ID' })
  @ApiParam({ name: 'channelId', description: 'Channel ID' })
  async removeChannelAdmin(@Param('userId') userId: number,@Param('targetId') targetId: number, @Param('channelId') channelId: number): Promise<void> {
	await this.channelService.removeChannelAdmin(userId, targetId, channelId);
	  }

  @Post(':userId/:channelId/user')
  async addChannelUser(@Param('userId') userId: number, @Param('channelId') channelId: number): Promise<ChannelUser> {
	return this.channelService.addChannelUser(userId, channelId);
  }

  @Get(':channelId/users')
  async getChannelUsers(@Param('channelId') channelId: number): Promise<ChannelUser[]> {
	return this.channelService.getChannelUsers(channelId);
  }

  @Get(':userId/:channelId/user')
  async getChannelUserByUserId(@Param('userId') userId: number, @Param('channelId') channelId: number): Promise<ChannelUser> {
	return this.channelService.getChannelUserByUserId(userId, channelId);
  }

  @Delete(':userId/:channelId/user')
  async removeChannelUser(@Param('userId') userId: number, @Param('channelId') channelId: number): Promise<void> {
	await this.channelService.removeChannelUser(userId, channelId);
  }

  @Post(':userId/:channelId/blocked')
  async addChannelBlockedUser(@Param('userId') userId: number, @Param('channelId') channelId: number): Promise<ChannelBlockedUser> {
	return this.channelService.addChannelBlockedUser(userId, channelId);
  }

  @Get(':channelId/blockedUsers')
  async getChannelBlockedUsers(@Param('channelId') channelId: number): Promise<ChannelBlockedUser[]> {
	return this.channelService.getChannelBlockedUsers(channelId);
  }

  @Get(':userId/:channelId/blocked')
  async getChannelBlockedUserByUserId(@Param('userId') userId: number, @Param('channelId') channelId: number): Promise<ChannelBlockedUser> {
	return this.channelService.getChannelBlockedUserByUserId(userId, channelId);
  }

  @Delete(':userId/:channelId/blocked')
  async removeChannelBlockedUser(@Param('userId') userId: number, @Param('channelId') channelId: number): Promise<void> {
	await this.channelService.removeChannelBlockedUser(userId, channelId);
  }

}
