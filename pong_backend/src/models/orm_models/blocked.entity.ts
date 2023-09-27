import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';

@Entity({ name: 'Blocked' })
export class Blocked {
  @PrimaryGeneratedColumn()
  blockId: number;

  @JoinColumn({ name: 'userId', referencedColumnName: 'userID' })
  user: User;

  @JoinColumn({ name: 'blockedUserId', referencedColumnName: 'userID' })
  blockedUser: User;
}
