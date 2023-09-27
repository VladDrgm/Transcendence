import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Channel } from './channel.entity';
import { User } from './user.entity';

@Entity({ name: 'ChannelBlockedUser' })
export class ChannelBlockedUser {
  @PrimaryGeneratedColumn()
  BlockedUserId: number;

  @Column()
  UserId: number;

  @Column()
  ChannelId: number;
}
