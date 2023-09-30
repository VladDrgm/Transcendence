import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Match } from 'src/models/orm_models/match.entity';
import { MatchDTO } from './matchDTO';
import { MatchHistory } from 'src/models/orm_models/matchHistory.entity';
import { AuthProtector, UserAuthDTO } from '../authProtectorService/authProtector';
import { User } from 'src/models/orm_models/user.entity';


@Injectable()
export class MatchService {
  constructor(
    @InjectRepository(Match)
    private readonly matchRepository: Repository<Match>,
    @InjectRepository(MatchHistory)
    private readonly matchHistoryRepository: Repository<MatchHistory>,
    private readonly authProtector: AuthProtector,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
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

    const winner = await this.userRepository.findOneBy({ userID: match.WinnerId });
    const loser = await this.userRepository.findOneBy({ userID: match.WinnerId === match.Player1Id ? match.Player2Id : match.Player1Id });

    loser.losses += 1;
    winner.wins += 1;
    winner.points += 1;
    loser.points -= 0.1;

    this.achievementsService(winner);

    await this.userRepository.save(winner);
    await this.userRepository.save(loser);

    return match;
  }

  async getMatchById(loggedUser: UserAuthDTO, callerId: number, matchId: number): Promise<Match> {
    if (parseInt(process.env.FEATURE_FLAG) === 1) {
        const passCheck = await this.authProtector.protectorCheck(loggedUser.passwordHash, callerId);
        if (!passCheck) {
            throw new HttpException('Unauthorized', 401);
        }
    }

    return this.matchRepository.findOneBy({ MatchId: matchId });
  }

  async getAllMatches(loggedUser: UserAuthDTO, callerId: number): Promise<Match[]> {
    if (parseInt(process.env.FEATURE_FLAG) === 1) {
        const passCheck = await this.authProtector.protectorCheck(loggedUser.passwordHash, callerId);
        if (!passCheck) {
            throw new HttpException('Unauthorized', 401);
        }
    }

    return this.matchRepository.find();
  }

  async deleteMatch(matchId: number): Promise<void> {
    await this.matchHistoryRepository.delete({ MatchId: matchId });

    await this.matchRepository.delete(matchId);
  }

  async getMatchHistory(loggedUser: UserAuthDTO, callerId: number, targetId: number): Promise<Match[]> {
    if (parseInt(process.env.FEATURE_FLAG) === 1) {
        const passCheck = await this.authProtector.protectorCheck(loggedUser.passwordHash, callerId);
        if (!passCheck) {
            throw new HttpException('Unauthorized', 401);
        }
    }

    const result1 = await this.matchRepository.find({
      where: { Player1Id: targetId },
    });
    const result2 = await this.matchRepository.find({
      where: { Player2Id: targetId },
    });

    const result = result1.concat(result2);

    return result;
  }

  achievementsService(user : User) {
    if (user.wins === 1) {
      user.achievementsCSV = user.achievementsCSV +"Achievement 1: First win";
    }

    if (user.wins === 5) {
      user.achievementsCSV = user.achievementsCSV + ", Achievement 2: 5 wins";
    }

    if (user.wins === 10) {
      user.achievementsCSV = user.achievementsCSV + ", Achievement 3: 10 wins";
    }
  }
}
