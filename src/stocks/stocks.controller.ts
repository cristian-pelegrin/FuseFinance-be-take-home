import { Controller, Get } from '@nestjs/common';

import { StocksService } from './stocks.service';
import { StockResponseDto } from './dtos/stock-response.dto';

@Controller('stocks')
export class StocksController {
    constructor(private readonly stocksService: StocksService) {}

    @Get()
    async getStocks(): Promise<StockResponseDto[]> {
        return this.stocksService.getStocks();
    }
}
