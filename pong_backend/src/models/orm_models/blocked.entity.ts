import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';

@Entity({ name: 'Blocked' })
export class Blocked {
  @PrimaryGeneratedColumn()
  blockId: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId', referencedColumnName: 'userID' })
  user: User;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'blockedUserId', referencedColumnName: 'userID' })
  blockedUser: User;
}
