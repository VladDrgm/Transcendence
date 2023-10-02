import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

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
