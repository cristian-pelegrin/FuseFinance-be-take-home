import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { StocksService } from './stocks.service';
import { StocksController } from './stocks.controller';

@Module({
  /* imports: [HttpModule], */ // remove if works globally
  providers: [StocksService],
  controllers: [StocksController]
})
export class StocksModule {}
