import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({ name: 'Match' })
export class Match {
  @PrimaryGeneratedColumn()
  MatchId: number;

  @Column({ nullable: false })
  Player1Id: number;

  @Column({ nullable: false })
  Player2Id: number;

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

  @Column({ nullable: false })
  WinnerId: number;

  @Column()
  WinningCondition: string;
}
