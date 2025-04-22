import { Module } from '@nestjs/common';

import { FuseModule } from 'src/fuse/fuse.module';
import { StocksService } from 'src/stocks/stocks.service';
import { StocksController } from 'src/stocks/stocks.controller';

@Module({
  imports: [
    FuseModule,
  ],
  providers: [StocksService],
  controllers: [StocksController]
})
export class StocksModule {}
