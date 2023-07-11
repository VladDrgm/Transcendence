import { Controller, Post, Body, Get } from '@nestjs/common';
import { MatchService } from './match.service';
import { Match } from 'src/models/orm_models/match.entity';
import { matchDTO } from './matchDTO';

@Controller('matches')
export class MatchController {
  constructor(private readonly matchService: MatchService) {}

  @Post()
  async createMatch(@Body() matchDto: matchDTO): Promise<Match> {
    return this.matchService.createMatch(matchDto);
  }

  @Get()
  async getAllMatches(): Promise<Match[]> {
    return this.matchService.getAllMatches();
  }
}
