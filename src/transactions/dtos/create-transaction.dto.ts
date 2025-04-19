// src/transactions/dto/create-transaction.dto.ts
import { IsString, IsNumber, Min } from 'class-validator';

export class CreateTransactionDto {
  @IsString()
  symbol: string;

  @IsNumber()
  @Min(0.01)
  quantity: number;

  @IsNumber()
  @Min(0.01)
  price: number;
}