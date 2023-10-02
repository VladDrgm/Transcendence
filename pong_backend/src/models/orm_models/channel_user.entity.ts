import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({ name: 'ChannelUser' })
export class ChannelUser {
  @PrimaryGeneratedColumn()
  CUserId: number;

  @Column()
  UserId: number;

  @Column()
  ChannelId: number;

  @Column({ nullable: true })
  MutedUntil: Date;
}
