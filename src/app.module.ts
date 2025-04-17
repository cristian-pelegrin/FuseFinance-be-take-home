import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StocksModule } from './stocks/stocks.module';
import { HoldingsModule } from './holdings/holdings.module';
import { TransactionsModule } from './transactions/transactions.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    HttpModule.register({ global: true }),
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
      // later: HoldingsModule, TransactionsModule
    }),
    StocksModule,
    HoldingsModule,
    TransactionsModule,
  ],
})
export class AppModule {}
