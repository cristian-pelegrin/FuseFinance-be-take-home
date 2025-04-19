import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { FuseModule } from 'src/fuse/fuse.module';
import { TransactionsService } from 'src/transactions/transactions.service';
import { TransactionsController } from 'src/transactions/transactions.controller';
import { Transaction } from 'src/transactions/entities/transaction.entity';

@Module({
  imports: [
    FuseModule,
    TypeOrmModule.forFeature([Transaction]),
  ],
  controllers: [TransactionsController],
  providers: [TransactionsService],
})
export class TransactionsModule {}
