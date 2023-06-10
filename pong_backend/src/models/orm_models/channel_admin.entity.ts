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

  @ManyToOne(() => User, (user) => user.adminChannels)
  user: User;

  @ManyToOne(() => Channel, (channel) => channel.admins)
  channel: Channel;
}
