import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Match } from 'src/models/orm_models/match.entity';
import { MatchDTO } from './matchDTO';
import { MatchHistory } from 'src/models/orm_models/matchHistory.entity';

@Injectable()
export class MatchService {
  constructor(
    @InjectRepository(Match)
    private readonly matchRepository: Repository<Match>,
    @InjectRepository(MatchHistory)
    private readonly matchHistoryRepository: Repository<MatchHistory>,
  ) {}

  async createMatch(matchDTO: MatchDTO): Promise<Match> {
    const matchDb = new Match();
    matchDb.Player1Id = matchDTO.Player1Id;
    matchDb.Player2Id = matchDTO.Player2Id;
    matchDb.Player1Points = matchDTO.Player1Points;
    matchDb.Player2Points = matchDTO.Player2Points;
    matchDb.GameType = matchDTO.GameType;
    matchDb.FinalResultString = matchDTO.FinalResultString;
    matchDb.startTime = matchDTO.startTime;
    matchDb.endTime = matchDTO.endTime;
    matchDb.WinnerId = matchDTO.WinnerId;
    matchDb.WinningCondition = matchDTO.WinningCondition;

    const match = await this.matchRepository.save(matchDb);

    const matchId = match.MatchId;

    const matchHistory = new MatchHistory();
    matchHistory.MatchId = matchId;
    matchHistory.Player1Id = match.Player1Id;
    matchHistory.Player2Id = match.Player2Id;
    this.matchHistoryRepository.save(matchHistory);

    return match;
  }

  async getMatchById(matchId: number): Promise<Match> {
    return this.matchRepository.findOneBy({ MatchId: matchId });
  }

  async getAllMatches(): Promise<Match[]> {
    return this.matchRepository.find();
  }

  async deleteMatch(matchId: number): Promise<void> {
    await this.matchRepository.delete(matchId);
  }
}
