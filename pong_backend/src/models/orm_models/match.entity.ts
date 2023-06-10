import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from './user.entity';
import { MatchHistory } from './matchHistory.entity';

@Entity({ name: 'Match' })
export class Match {
  @PrimaryGeneratedColumn()
  MatchId: number;

  @ManyToOne(() => MatchHistory, (matchHistory) => matchHistory.matches)
  matchHistory: MatchHistory;

  @ManyToOne(() => User)
  UserId: User;

  @ManyToOne(() => User)
  OpponentId: User;

  @Column()
  Player1Points: number;

  @Column()
  Player2Points: number;

  @Column()
  GameType: string;

  @Column()
  FinalResultString: string;

  @Column()
  Date: Date;
}