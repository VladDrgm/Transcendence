import {
  Controller,
  Post,
  Body,
  Delete,
  Param,
  Put,
  ParseIntPipe,
} from '@nestjs/common';
import { MatchService } from './match.service';
import { Match } from 'src/models/orm_models/match.entity';
import { MatchDTO } from './matchDTO';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserAuthDTO } from '../authProtectorService/authProtector';

@ApiTags('Match')
@Controller('match')
export class MatchController {
  constructor(private readonly matchService: MatchService) {}

  @Post()
  @ApiOperation({ summary: 'Create a match' })
  async createMatch(@Body() matchDto: MatchDTO): Promise<Match> {
    return this.matchService.createMatch(matchDto);
  }

  @Put(':callerId/all')
  @ApiOperation({ summary: 'Get all matches' })
  async getAllMatches(
    @Param('callerId', ParseIntPipe) callerId: number,
    @Body() loggedUser: UserAuthDTO,
  ): Promise<Match[]> {
    return this.matchService.getAllMatches(loggedUser, callerId);
  }

  @Put('all/:callerId/:matchId')
  @ApiOperation({ summary: 'Get match by id' })
  async getMatchById(
    @Param('callerId', ParseIntPipe) callerId: number,
    @Param('matchId', ParseIntPipe) matchId: number,
    @Body() loggedUser: UserAuthDTO,
  ): Promise<Match> {
    return this.matchService.getMatchById(loggedUser, callerId, matchId);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a match by matchId' })
  async deleteMatch(@Param('id') matchId: number): Promise<void> {
    return this.matchService.deleteMatch(matchId);
  }

  @Put(':callerId/:targetId/matchHistory')
  @ApiOperation({ summary: 'Get match history of a user' })
  async getMatchHistory(
    @Param('callerId') callerId: number,
    @Param('targetId') targetId: number,
    @Body() loggedUser: UserAuthDTO,
  ): Promise<Match[]> {
    return this.matchService.getMatchHistory(loggedUser, callerId, targetId);
  }
}
