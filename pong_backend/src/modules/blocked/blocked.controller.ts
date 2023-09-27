import { Controller, Put, Post, Delete, Body, Param } from '@nestjs/common';

import { ApiTags, ApiOperation, ApiParam } from '@nestjs/swagger';
import { BlockedService } from './blocked.service';
import { Blocked } from 'src/models/orm_models/blocked.entity';
import { CreateBlockedDto } from './blockedDTO';
import { AuthProtector, UserAuthDTO } from '../authProtectorService/authProtector';

@ApiTags('Blocked')
@Controller('blocked')
export class BlockedController {
  constructor(private readonly blockedService: BlockedService) {}

  @Put(':requesterId')
  @ApiOperation({ summary: 'Get all the blocked users for the requester' })
  @ApiParam({ name: 'requesterId', description: 'Caller ID' })
  async getBlockedUserById(
    @Param('requesterId') requesterId: number,
    @Body() loggedUser : UserAuthDTO
  ): Promise<Blocked[]> {
    return this.blockedService.findAllBlockedForOneUser(loggedUser, requesterId);
  }

  @Post(":callerId/:targetId")
  @ApiOperation({ summary: 'Block a user' })
  @ApiParam({
    name: 'callerId',
    description: 'Caller ID',
    required: true,
    type: Number,
    example: 9,
  })
  @ApiParam({
    name: 'targetId',
    description: 'User to block ID',
    required: true,
    type: Number,
    example: 1,
  })
  async blockUser(
    @Param('callerId') callerId: number,
    @Param('targetId') targetId: number,
    @Body() loggedUser : UserAuthDTO
  ): Promise<Blocked> {
    return this.blockedService.blockUser(loggedUser, callerId, targetId);
  }

  @Delete(":callerId/:targetId")
  @ApiOperation({ summary: 'Unblock a user' })
  @ApiParam({
    name: 'callerId',
    description: 'Caller ID',
    required: true,
    type: Number,
    example: 9,
  })
  @ApiParam({
    name: 'targetId',
    description: 'User to unblock ID',
    required: true,
    type: Number,
    example: 1,
  })
  async unblockUser(
    @Param('callerId') callerId: number,
    @Param('targetId') targetId: number,
    @Body() loggedUser : UserAuthDTO
  ): Promise<string> {
    return await this.blockedService.unblockUser(loggedUser, callerId, targetId);
  }

  @Put(':callerId/:blockedId')
  @ApiOperation({ summary: 'Check if a user is blocked and return the entity' })
  @ApiParam({
    name: 'callerId',
    description: 'Caller ID',
    required: true,
    type: Number,
    example: 9,
  })
  @ApiParam({
    name: 'targetId',
    description: 'User to check ID',
    required: true,
    type: Number,
    example: 1,
  })
  async checkIfBlocked(
    @Param('callerId') callerId: number,
    @Param('targetId') targetId: number,
    @Body() loggedUser : UserAuthDTO
  ): Promise<Blocked> {
    return await this.blockedService.getOneBlockedUser(loggedUser, callerId, targetId);
  }
}
