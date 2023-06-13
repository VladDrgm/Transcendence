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
	async create(@Body() user: Channel): Promise<Channel> {
	  return this.channelService.create(user);
	}
  
	@Delete(':id')
	async remove(@Param('id') id: number): Promise<void> {
	  await this.channelService.remove(id);
	}
  }