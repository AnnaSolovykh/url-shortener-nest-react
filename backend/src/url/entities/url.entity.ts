import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from 'typeorm';
import { ClickStat } from './click-stat.entity';

@Entity()
export class Url {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  originalUrl: string;

  @Column({ unique: true, length: 20 })
  alias: string;

  @Column({ nullable: true })
  expiresAt?: Date;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ default: 0 })
  clickCount: number;

  @OneToMany(() => ClickStat, (stat) => stat.url)
  stats: ClickStat[];
}
