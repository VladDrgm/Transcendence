import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({ name: 'Friend' })
export class Friend {
  @PrimaryGeneratedColumn()
  FId: number;

  @Column({ nullable: false })
  UserId: number;

  @Column({ nullable: false })
  FriendId: number;
}
