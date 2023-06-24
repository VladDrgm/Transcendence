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
import { Channel } from 'src/models/orm_models/channel.entity';
import { ChannelService } from './channel.service';
import { ApiBody } from '@nestjs/swagger';
import { ChannelAdmin } from 'src/models/orm_models/channel_admin.entity';
import { channel } from 'diagnostics_channel';
import { ChannelUser } from 'src/models/orm_models/channel_user.entity';

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
  async create(@Body() channel: Channel): Promise<Channel> {
    return this.channelService.create(channel);
  }

  @Delete(':id')
  async remove(@Param('id') id: number): Promise<void> {
    await this.channelService.remove(id);
  }

  @Post(':userId/:channelId/admin')
  async addChannelAdmin(@Param('userId') userId: number, @Param('channelId') channelId: number): Promise<ChannelAdmin>{
	return this.channelService.addAdmin(userId, channelId);
  }

  @Get(':channelId/admins')
  async getChannelAdmins(@Param('channelId') channelId: number): Promise<ChannelAdmin[]> {
	return this.channelService.getChannelAdmins(channelId);
  }

  @Get(':userId/:channelId/admin')
  async getChannelAdminByUserId(@Param('userId') userId: number, @Param('channelId') channelId: number): Promise<ChannelAdmin> {
	return this.channelService.getChannelAdminByUserId(userId, channelId);
	  }

  @Delete(':userId/:channelId/admin')
  async removeChannelAdmin(@Param('userId') userId: number, @Param('channelId') channelId: number): Promise<void> {
	await this.channelService.removeChannelAdmin(userId, channelId);
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
}
