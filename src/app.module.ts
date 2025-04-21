import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';

import { StocksModule } from 'src/stocks/stocks.module';
import { HoldingsModule } from 'src/holdings/holdings.module';
import { TransactionsModule } from 'src/transactions/transactions.module';
import { FuseModule } from 'src/fuse/fuse.module';
import { ReportsModule } from 'src/reports/reports.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get('DB_HOST'),
        port: config.get('DB_PORT'),
        username: config.get('DB_USERNAME'),
        password: config.get('DB_PASSWORD'),
        database: config.get('DB_DATABASE'),
        entities: [__dirname + '/**/entities/*.entity{.ts,.js}'],
        synchronize: process.env.NODE_ENV !== 'production', // use ONLY for development
        logging: false,
      }),
      inject: [ConfigService],
    }),
    ScheduleModule.forRoot(),
    StocksModule,
    HoldingsModule,
    TransactionsModule,
    FuseModule,
    ReportsModule,
  ],
})
export class AppModule {}
