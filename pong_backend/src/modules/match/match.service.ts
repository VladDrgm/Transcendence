import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Match } from 'src/models/orm_models/match.entity';
import { matchDTO } from './matchDTO';
import { async } from 'rxjs';
import { MatchHistory } from 'src/models/orm_models/matchHistory.entity';

@Injectable()
export class MatchService {
  constructor(
    @InjectRepository(Match)
    private readonly matchRepository: Repository<Match>,
    @InjectRepository(MatchHistory)
    private readonly matchHistoryRepository: Repository<MatchHistory>,
  ) {}
  async createMatch(matchDto: matchDTO): Promise<Match> {
    const match = this.matchRepository.create(matchDto);
    return this.matchRepository.save(match);
  }

  async getAllMatches(): Promise<Match[]> {
    return this.matchRepository.find();
  }
}
