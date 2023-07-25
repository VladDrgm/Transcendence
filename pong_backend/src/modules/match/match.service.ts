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
  ) {}

  async createMatch(
    matchDTO: MatchDTO,
    p1Id: number,
    p2Id: number
    ): Promise<Match> {
    const matchDb = new Match();
    matchDb.Player1.userID = p1Id;
    matchDb.Player2.userID = p2Id;
    matchDb.Player1Points = matchDTO.Player1Points;
    matchDb.Player2Points = matchDTO.Player2Points;
    matchDb.GameType = matchDTO.GameType;
    matchDb.FinalResultString = matchDTO.FinalResultString;
    matchDb.startTime = matchDTO.startTime;
    matchDb.endTime = matchDTO.endTime;
    matchDb.WinnerId = matchDTO.WinnerId;
    matchDb.WinningCondition = matchDTO.WinningCondition;

    const MatchId = await this.matchRepository
      .save(matchDb)
      .then((match) => match.MatchId);

    const player1MatchHistory = new MatchHistory();
    player1MatchHistory.MatchId = MatchId;
    player1MatchHistory.UserId.userID = matchDb.Player1.userID;
    this.matchRepository.save(player1MatchHistory);

    const player2MatchHistory = new MatchHistory();
    player2MatchHistory.MatchId = MatchId;
    player2MatchHistory.UserId.userID = matchDb.Player2.userID;
    this.matchRepository.save(player2MatchHistory);

    return this.matchRepository.save(matchDb);
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
