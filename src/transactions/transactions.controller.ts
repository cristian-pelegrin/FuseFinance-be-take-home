import { Controller, Body, Post } from '@nestjs/common';

import { TransactionsService } from './transactions.service';
import { CreateTransactionDto } from './dtos/create-transaction.dto';
@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Post()
  async buy(@Body() transaction: CreateTransactionDto) {
    return this.transactionsService.buyStock(transaction);
  }
}
