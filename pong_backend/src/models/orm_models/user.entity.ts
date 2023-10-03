import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

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
    nullable: true,
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
    name: '42IntraUsername',
    default: null,
  })
  intraUsername: string;

  @Column({
    type: 'text',
    default: null,
  })
  passwordHash: string;

  @Column({
    type: 'boolean',
    default: false,
  })
  isTFAEnabled: boolean;

  @Column({
    type: 'text',
    default: null,
  })
  token: string;

  @Column({
    type: 'text',
    default: null,
  })
  TFASecret: string;

  @Column({
    type: 'boolean',
    name: 'is2FAEnabled',
    default: 'false',
  })
  is2FAEnabled: boolean;
}
