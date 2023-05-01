import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { Friend } from './friend';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  UserId: number;

  @Column()
  Nickname: string;

  @Column()
  Avatar: string;

  @Column()
  Wins: number;

  @Column()
  Losses: number;

  @Column()
  LadderLevel: number;

  @Column()
  Status: string;

  @Column()
  Achievements: string;

  @Column()
  PasswordHash: string;

  @OneToMany(() => Friend, friend => friend.user)
  friends: Friend[];
}
