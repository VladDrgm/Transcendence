import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, Column } from 'typeorm';
import { User } from './user.entity';
import { ForeignKeyMetadata } from 'typeorm/metadata/ForeignKeyMetadata';

@Entity({ name: 'Friend' })
export class Friend {
  @PrimaryGeneratedColumn()
  FId: number;

  @Column({ nullable: false })
  UserId: number;

  @Column({ nullable: false })
  FriendId: number;
}
