import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Channel } from './channel.entity';
import { User } from './user.entity';

@Entity({ name: 'ChannelAdmin' })
export class ChannelAdmin {
  @PrimaryGeneratedColumn()
  ChannelAdminId: number;

  @Column()
  UserId: number;

  @Column()
  ChannelId: number;

  channel: Channel;
}
