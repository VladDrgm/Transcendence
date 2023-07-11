import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Blocked } from './blocked.entity';
import { Friend } from './friend.entity';
import { ChannelAdmin } from './channel_admin.entity';
import { ChannelBlockedUser } from './channel_blocked_user.entity';
import { ChannelUser } from './channel_user.entity';

@Entity({ name: 'User' })
export class User {
  @PrimaryGeneratedColumn({
    type: 'int',
  })
  userID: number;

  @Column({
    type: 'text',
  })
  username: string;

  @Column({
    name: 'avatar',
    type: 'text',
  })
  avatarPath: string;

  @Column({
    type: 'int',
    default: 0,
  })
  wins: number;

  @Column({
    type: 'int',
    default: 0,
  })
  losses: number;

  @Column({
    type: 'int',
    default: 0,
  })
  points: number;

  @Column({
    type: 'text',
    default: 'offline',
  })
  status: string;

  @Column({
    type: 'text',
    name: 'achievements',
    default: '',
  })
  achievementsCSV: string;

  @Column({
    type: 'text',
    default: null,
  })
  passwordHash: string;

  @OneToMany(() => Friend, (friend) => friend.user)
  friends: User[];

  @OneToMany(() => Friend, (friend) => friend.friendUser)
  befriendedBy: User[];

  @OneToMany(() => Blocked, (block) => block.user)
  blocked: User[];

  @OneToMany(() => Blocked, (block) => block.blockedUser)
  blockedBy: User[];

  @OneToMany(() => ChannelAdmin, (channelAdmins) => channelAdmins.user)
  adminChannels: ChannelAdmin[];

  @OneToMany(
    () => ChannelBlockedUser,
    (channelBlockedUsers) => channelBlockedUsers.user,
  )
  blockedChannels: ChannelBlockedUser[];

  @OneToMany(() => ChannelUser, (channelUsers) => channelUsers.user)
  channels: ChannelUser[];
}
