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

@ApiTags('Friend')
@Controller('friend')
export class FriendController {
  constructor(private readonly channelService: FriendService) {}

  @Get()
  async findAll(): Promise<Friend[]> {
    return this.channelService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<Friend> {
    return this.channelService.findOne(id);
  }

  @Delete(':id')
  async remove(@Param('id') id: number): Promise<void> {
    await this.channelService.remove(id);
  }
}
