import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from 'typeorm';
import { Url } from './url.entity';

@Entity()
export class ClickStat {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  ip: string;

  @CreateDateColumn()
  clickedAt: Date;

  @ManyToOne(() => Url, (url) => url.stats, { onDelete: 'CASCADE' })
  url: Url;
}
