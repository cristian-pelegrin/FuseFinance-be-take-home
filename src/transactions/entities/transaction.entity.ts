import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

export enum TransactionStatus {
  PENDING = 'pending',
  SUCCESS = 'success',
  FAILED = 'failed',
}
@Entity()
export class Transaction {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  symbol: string;

  @Column('float')
  quantity: number;

  @Column('float')
  price: number;

  @Column({
    type: 'text',
    enum: TransactionStatus,
    default: TransactionStatus.PENDING
  })
  status: TransactionStatus;

  @Column({ nullable: true })
  errorMessage?: string;

  @CreateDateColumn()
  createdAt: Date;
}