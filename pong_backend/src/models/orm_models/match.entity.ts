import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToOne } from 'typeorm';
import { User } from './user.entity';
import { MatchHistory } from './matchHistory.entity';

@Entity({ name: 'Match' })
export class Match {
  @PrimaryGeneratedColumn()
  MatchId: number;

  @ManyToOne(() => MatchHistory, (matchHistory) => matchHistory.matches)
  matchHistory: MatchHistory;

  @ManyToOne(() => User)
  Player1: User;

  @ManyToOne(() => User)
  Player2: User;

  @Column()
  Player1Points: number;

  @Column()
  Player2Points: number;

  @Column()
  GameType: string;

  @Column()
  FinalResultString: string;

  @Column()
  startTime: Date;

  @Column()
  endTime: Date;

  @OneToOne(() => User)
  WinnerId: number;

  @Column()
  WinningCondition: string;
}
