import { Controller, Get, Query } from '@nestjs/common';

import { StocksService } from 'src/stocks/stocks.service';
import { StockResponseDto } from 'src/stocks/dtos/stock-response.dto';

@Controller('stocks')
export class StocksController {
    constructor(
        private readonly stocksService: StocksService,
    ) {}

    @Get()
    async getStocks(@Query('nextToken') nextToken?: string): Promise<StockResponseDto> {
        return this.stocksService.getStocks(nextToken);
    }
}
