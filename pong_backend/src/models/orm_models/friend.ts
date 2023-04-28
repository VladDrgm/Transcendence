import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { User } from './user';

@Entity()
export class Friend {
  @PrimaryGeneratedColumn()
  FId: number;

  @ManyToOne(() => User, user => user.friends)
  @JoinColumn({ name: "FriendId" })
  friend: User;

  @ManyToOne(() => User, user => user.friends)
  @JoinColumn({ name: "UserId" })
  user: User;

  @Column()
  Status: string;
}
