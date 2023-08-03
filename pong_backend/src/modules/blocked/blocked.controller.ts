import { Controller, Get, Post, Delete, Body, Param } from '@nestjs/common';

import { ApiTags, ApiOperation, ApiParam } from '@nestjs/swagger';
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
  async getBlockedUserById(
    @Param('requesterId') requesterId: number,
  ): Promise<Blocked[]> {
    return this.blockedService.findAllBlockedForOneUser(requesterId);
  }

  @Post()
  @ApiOperation({ summary: 'Block a user' })
  @ApiParam({
    name: 'requesterId',
    description: 'Caller ID',
    required: true,
    type: Number,
    example: 9,
  })
  @ApiParam({
    name: 'blockedId',
    description: 'User to block ID',
    required: true,
    type: Number,
    example: 1,
  })
  async blockUser(@Body() blocked: CreateBlockedDto): Promise<Blocked> {
    return this.blockedService.blockUser(blocked);
  }

  @Delete()
  @ApiOperation({ summary: 'Unblock a user' })
  @ApiParam({
    name: 'requesterId',
    description: 'Caller ID',
    required: true,
    type: Number,
    example: 9,
  })
  @ApiParam({
    name: 'blockedId',
    description: 'User to unblock ID',
    required: true,
    type: Number,
    example: 1,
  })
  async unblockUser(@Body() blocked: CreateBlockedDto): Promise<string> {
    return await this.blockedService.unblockUser(blocked);
  }

  @Get(':requesterId/:blockedId')
  @ApiOperation({ summary: 'Check if a user is blocked and return the entity' })
  @ApiParam({
    name: 'requesterId',
    description: 'Caller ID',
    required: true,
    type: Number,
    example: 9,
  })
  @ApiParam({
    name: 'blockedId',
    description: 'User to check ID',
    required: true,
    type: Number,
    example: 1,
  })
  async checkIfBlocked(
    @Param('requesterId') requesterId: number,
    @Param('blockedId') blockedId: number,
  ): Promise<Blocked> {
    return await this.blockedService.getOneBlockedUser(requesterId, blockedId);
  }
}
