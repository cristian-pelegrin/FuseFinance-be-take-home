import { Injectable, HttpException, HttpStatus, Inject, Logger } from '@nestjs/common';
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';

import { FuseApiService } from 'src/fuse/fuse-api/fuse-api.service';
import { StockResponseDto } from 'src/stocks/dtos/stock-response.dto';

const STOCKS_CACHE_TTL = 60000; // 60 seconds
const getStocksCacheKey = (nextToken?: string) => `stocks:page:${nextToken || 'first'}`;
@Injectable()
export class StocksService {
    private readonly logger = new Logger(StocksService.name);

    constructor(
        private readonly fuseApi: FuseApiService,
        @Inject(CACHE_MANAGER) 
        private readonly cacheManager: Cache,
    ) {}

    async getStocks(nextToken?: string): Promise<StockResponseDto> {
        const cacheKey = getStocksCacheKey(nextToken);
        
        const cachedStocks = await this.cacheManager.get<StockResponseDto>(cacheKey);
        if (cachedStocks) {
            return cachedStocks;
        }
    
        try {
            const response = await this.fuseApi.getStocks(nextToken, 3);
            const data: StockResponseDto = response.data.data;

            if (!Array.isArray(data.items)) {
                throw new HttpException(
                    'Invalid data structure',
                    HttpStatus.BAD_REQUEST
                );
            }

            await this.cacheManager.set(cacheKey, data, STOCKS_CACHE_TTL);

            return data;
        } catch (error) {
            this.logger.error('Error details:', error.response?.data || error.message);
            if (error.response) {
                throw new HttpException(
                    error.response.data || 'Error fetching stocks',
                    error.response.status
                );
            } 
            
            if (error.request) {
                throw new HttpException(
                    'No response from server',
                    HttpStatus.SERVICE_UNAVAILABLE
                );
            } 
            
            throw new HttpException(
                'Error setting up the request',
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }
}
