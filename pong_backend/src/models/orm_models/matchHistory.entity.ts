import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { User } from './user.entity';
import { Match } from './match.entity';

@Entity({ name: 'MatchHistory' })
export class MatchHistory {
  @PrimaryGeneratedColumn()
  MatchHistoryId: number;

  @Column()
  MatchId: number;

  @ManyToOne(() => User)
  UserId: User;

  @OneToMany(() => Match, (match) => match.matchHistory)
  matches: Match[];
}
