import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Channel } from './channel.entity';
import { User } from './user.entity';

@Entity({ name: 'ChannelUser' })
export class ChannelUser {
  @PrimaryGeneratedColumn()
  CUserId: number;

  @Column()
  UserId: number;

  @Column()
  ChannelId: number;

  @ManyToOne(() => User, (user) => user.channels)
  user: User;

  @ManyToOne(() => Channel, (channel) => channel.users)
  channel: Channel;
}