import { Entity, Column, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class Holding {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  symbol: string;

  @Column('float')
  amount: number;

  @Column('float')
  avgPrice: number;

  @UpdateDateColumn()
  lastUpdated: Date;
}