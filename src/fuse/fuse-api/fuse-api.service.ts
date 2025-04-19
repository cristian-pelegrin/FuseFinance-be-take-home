import { Injectable, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { AxiosResponse, AxiosError } from 'axios';

import { FuseApiException } from 'src/fuse/exceptions/fuse-api.exception';

interface StocksResponseData {
  items: {
    symbol: string;
    name: string;
    sector: string;
    price: number;
    change: number;
    lastUpdated: string;
  }[];
  nextToken?: string;
}

interface BuyStockResponseData {
  order: {
    symbol: string;
    quantity: number;
    price: number;
    total: number;
  };
}

@Injectable()
export class FuseApiService {
  private readonly apiUrl: string;
  private readonly apiKey: string;

  constructor(
    private readonly http: HttpService,
    private readonly config: ConfigService,
  ) {
    const apiUrl = this.config.get('FUSE_API_URL');
    const apiKey = this.config.get('FUSE_API_KEY');
    
    if (!apiUrl || !apiKey) {
        throw new Error('Missing FUSE_API_URL or FUSE_API_KEY');
    }
    
    this.apiUrl = apiUrl;
    this.apiKey = apiKey;
  }

  async getStocks(nextToken?: string): Promise<AxiosResponse<{ data: StocksResponseData }>> {
    try {
      const response$ = this.http.get<{ data: StocksResponseData }>(`${this.apiUrl}/stocks`, {
        headers: { 'x-api-key': this.apiKey },
        params: nextToken ? { nextToken } : {},
      });
      const response = await firstValueFrom(response$);
      return response;
    } catch (error) {
      this.handleApiError(error);
    }
  }

  async buyStock(symbol: string, quantity: number, price: number): Promise<AxiosResponse<{ data: BuyStockResponseData }>> {
    try {
      const response$ = this.http.post<{ data: BuyStockResponseData }>(
        `${this.apiUrl}/stocks/${symbol}/buy`,
        { quantity, price },
        {
          headers: { 'x-api-key': this.apiKey },
        }
      );
      const response = await firstValueFrom(response$);
      return response;
    } catch (error) {
      this.handleApiError(error);
    }
  }

  private handleApiError(error: any): never {
    if (error instanceof AxiosError && error.response) {
      const status = error.response.status;
      const message = error.response.data?.message || 'External API error';
      throw new FuseApiException(message, status);
    }
    
    throw new FuseApiException();
  }
}