import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { Channel } from './channel.entity';

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
