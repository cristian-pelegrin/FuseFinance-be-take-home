import { Injectable, HttpException, HttpStatus } from '@nestjs/common';

import { FuseApiService } from 'src/fuse/fuse-api/fuse-api.service';
import { StockResponseDto } from 'src/stocks/dtos/stock-response.dto';

@Injectable()
export class StocksService {
    constructor(
        private readonly fuseApi: FuseApiService,
    ) {}

    async getStocks(): Promise<StockResponseDto[]> {
        const allStocks: StockResponseDto[] = [];
        let nextToken: string | undefined = undefined;
    
        try {
            do {
                const response = await this.fuseApi.getStocks(nextToken);
                console.log('Response:', response.data);
                const data = response.data.data;

                if (Array.isArray(data.items)) {
                    allStocks.push(...data.items);
                }

                nextToken = data.nextToken;
            } while (nextToken);
            
            console.log('All stocks:', allStocks);
            return allStocks;
        } catch (error) {
            console.error('Error details:', error.response?.data || error.message);
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
