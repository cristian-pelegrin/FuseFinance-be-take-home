import { Controller, Get, Post, Body, Query, HttpStatus, HttpException } from '@nestjs/common';
import { StocksService } from './stocks.service';
import { StockResponseDto } from './dtos/stock-response.dto';
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';
import { Inject } from '@nestjs/common';

@Controller('stocks')
export class StocksController {
    constructor(
        private readonly stocksService: StocksService,
        @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    ) {}

    @Get()
    async getStocks(@Query('nextToken') nextToken?: string): Promise<StockResponseDto> {
        return this.stocksService.getStocks(nextToken);
    }
}
