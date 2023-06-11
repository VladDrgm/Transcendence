import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';

@Entity({ name: 'Blocked' })
export class Blocked {
  @PrimaryGeneratedColumn()
  blockId: number;

  @ManyToOne(() => User, (user) => user.blocked)
  @JoinColumn({ name: 'userId', referencedColumnName: 'userID' })
  user: User;

  @ManyToOne(() => User, (user) => user.blockedBy)
  @JoinColumn({ name: 'blockedUserId', referencedColumnName: 'userID' })
  blockedUser: User;
}
