import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({ name: 'ChannelBlockedUser' })
export class ChannelBlockedUser {
  @PrimaryGeneratedColumn()
  BlockedUserId: number;

  @Column()
  UserId: number;

  @Column()
  ChannelId: number;
}
