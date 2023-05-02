import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToMany, JoinColumn, JoinTable } from 'typeorm';
import { Blocked } from './blocked.entity';
import { Friend } from './friend.entity';

export enum StatusValue {
  Available = 'available',
  Offline = 'offline',
  InGame = 'ingame'
}

@Entity()
export class User {
  @PrimaryGeneratedColumn({
    type: 'int'
  })
  userID: number;

  @Column({
    type: 'text'
  })
  username: string;

  @Column({
    name: 'avatar',
    type: 'text',
  })
  avatarPath: string;

  @Column({
    type: 'int'
  })
  wins: number;

  @Column({
    type: 'int'
  })
  losses: number;

  @Column({
    type: 'int'
  })
  ladderLevel: number;

  @Column({
    type: 'enum',
    enum: StatusValue,
    default: StatusValue.Offline
  })
  status: StatusValue;

  @Column({
    type: 'text',
    name: 'achievements'
  })
  achievementsCSV: string;

  @Column({
    type: 'text'
  })
  passwordHash: string;

  @OneToMany(() => Friend, friend => friend.user)
  friends: User[];

  @OneToMany(() => Friend, friend => friend.friendUser)
  befriendedBy: User[];

  @OneToMany(() => Blocked, block => block.user)
  blocked: User[];

  @OneToMany(() => Blocked, block => block.blockedUser)
  blockedBy: User[];
}

