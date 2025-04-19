import { Entity, Column, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class Holding {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  symbol: string;

  @Column('float')
  quantity: number;

  @Column('float')
  avgPrice: number;

  @UpdateDateColumn()
  lastUpdated: Date;

  updateQuantityAndPrice(quantity: number, price: number): void {
    const totalCost = (this.quantity * this.avgPrice) + (quantity * price);
    const totalQuantity = this.quantity + quantity;
    this.quantity = totalQuantity;
    this.avgPrice = totalCost / totalQuantity;
  }
}