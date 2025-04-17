import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { StockResponseDto } from './dtos/stock-response.dto';

interface ApiStockResponse {
  data: {
    items: StockResponseDto[];
    nextToken?: string;
  };
}

@Injectable()
export class StocksService {
    private apiUrl: string;
    private apiKey: string;

    constructor(
        private readonly httpService: HttpService,
        private readonly configService: ConfigService,
    ) {
        const apiUrl = this.configService.get('FUSE_API_URL');
        const apiKey = this.configService.get('FUSE_API_KEY');
        
        if (!apiUrl || !apiKey) {
            throw new Error('Missing FUSE_API_URL or FUSE_API_KEY');
        }
        
        this.apiUrl = apiUrl;
        this.apiKey = apiKey;
    }   

    async getStocks(): Promise<StockResponseDto[]> {
        const url = `${this.apiUrl}/stocks`;
        const allStocks: StockResponseDto[] = [];
        let nextToken: string | undefined = undefined;
    
            try {
                do {
                    const params = nextToken ? { nextToken } : {};
                    const response$ = this.httpService.get<ApiStockResponse>(url, {
                        headers: {
                            'x-api-key': this.apiKey,
                        },
                        params,
                    });
                
                    const response = await firstValueFrom<{ data: ApiStockResponse }>(response$);
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
