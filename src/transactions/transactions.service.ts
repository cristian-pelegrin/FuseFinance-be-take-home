import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { Between, DataSource, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { FuseApiService } from 'src/fuse/fuse-api/fuse-api.service';
import { FuseApiException } from 'src/fuse/exceptions/fuse-api.exception';
import { Holding } from 'src/holdings/entities/holding.entity';
import { Transaction, TransactionStatus } from 'src/transactions/entities/transaction.entity';
import { CreateTransactionDto } from 'src/transactions/dtos/create-transaction.dto';

@Injectable()
export class TransactionsService {
    constructor(
        private fuseApi: FuseApiService,
        private dataSource: DataSource,
        @InjectRepository(Transaction)
        private transactionRepo: Repository<Transaction>
    ) {}
    
    async buyStock(transactionDto: CreateTransactionDto) {
        const { symbol, quantity, price } = transactionDto;
        
        const transaction = this.transactionRepo.create({
            symbol,
            quantity,
            price,
            status: TransactionStatus.PENDING,
        });
        await this.transactionRepo.save(transaction);
        
        try {
            await this.fuseApi.buyStock(symbol, quantity, price, 3);
            
            await this.dataSource.transaction(async (manager) => {
                transaction.status = TransactionStatus.SUCCESS;
                await manager.save(transaction);
                
                const holding = await manager.findOne(Holding, { where: { symbol } });
                if (holding) {
                    holding.updateQuantityAndPrice(quantity, price);
                    await manager.save(holding);
                } else {
                    const newHolding = manager.create(Holding, {
                        symbol,
                        quantity,
                        avgPrice: price,
                    });
                    await manager.save(newHolding);
                }
            });
            
            return transaction;
        } catch (err) {
            transaction.status = TransactionStatus.FAILED;
            
            if (err instanceof FuseApiException) {
                transaction.errorMessage = err.message;
                await this.transactionRepo.save(transaction);
                throw err;
            } else {
                transaction.errorMessage = err.message || 'Unknown error';
                await this.transactionRepo.save(transaction);
                throw new HttpException(
                    'Error processing transaction',
                    HttpStatus.INTERNAL_SERVER_ERROR
                );
            }
        }
    }

    async getTransactionsInRange(start: Date, end: Date): Promise<Transaction[]> {
        return this.transactionRepo.find({
            where: { createdAt: Between(start, end) },
            order: { createdAt: 'ASC' },
        });
    }
}
