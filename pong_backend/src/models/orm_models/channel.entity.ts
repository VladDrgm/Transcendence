import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({ name: 'Channels' })
export class Channel {
  @PrimaryGeneratedColumn()
  ChannelId: number;

  @Column()
  OwnerId: number;

  @Column()
  Name: string;

  @Column()
  Type: string;

  @Column({ nullable: true })
  Password: string;
}
