import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, Column } from 'typeorm';

@Entity({ name: 'Blocked' })
export class Blocked {
  @PrimaryGeneratedColumn()
  blockId: number;

  @Column({ nullable: false })
  userId: number;

  @Column({ nullable: false })
  blockedUserId: number;
}
