import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { StocksModule } from 'src/stocks/stocks.module';
import { HoldingsModule } from 'src/holdings/holdings.module';
import { TransactionsModule } from 'src/transactions/transactions.module';
import { FuseModule } from 'src/fuse/fuse.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        type: config.get<'sqlite'>('DB_TYPE'),
        database: config.get<string>('DB_DATABASE'),
        entities: [__dirname + '/**/entities/*.entity{.ts,.js}'],
        synchronize: true, // use ONLY for development
        logging: true,
      }),
      inject: [ConfigService],
    }),
    StocksModule,
    HoldingsModule,
    TransactionsModule,
    FuseModule,
  ],
})
export class AppModule {}
