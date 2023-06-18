import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';

@Entity({ name: 'Friend' })
export class Friend {
  @PrimaryGeneratedColumn()
  FId: number;

  @ManyToOne(() => User, (user) => user.friends)
  @JoinColumn({ name: 'userId', referencedColumnName: 'userID' })
  user: User;

  @ManyToOne(() => User, (user) => user.befriendedBy)
  @JoinColumn({ name: 'friendId', referencedColumnName: 'userID' })
  friendUser: User;
}
