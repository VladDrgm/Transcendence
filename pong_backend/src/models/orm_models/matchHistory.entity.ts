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

  @Column()
  Player1Id: number;

  @Column()
  Player2Id: number;
}
