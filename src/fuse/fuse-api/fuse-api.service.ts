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
  private readonly defaultRetries = 1;
  private readonly baseDelay = 1000; // 1 second

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

  async getStocks(nextToken?: string, retries?: number): Promise<AxiosResponse<{ data: StocksResponseData }>> {
    return this.retryWithBackoff(async () => {
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
    }, retries);
  }

  async buyStock(symbol: string, quantity: number, price: number, retries?: number): Promise<AxiosResponse<{ data: BuyStockResponseData }>> {
    return this.retryWithBackoff(async () => {
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
    }, retries);
  }

   /**
   * Retries a failed operation with exponential backoff
   */
   private async retryWithBackoff<T>(
    operation: () => Promise<T>,
    retries: number = this.defaultRetries,
    attempt: number = 1
  ): Promise<T> {
    try {
      return await operation();
    } catch (error) {
      if (error.status === HttpStatus.INTERNAL_SERVER_ERROR && attempt < retries) {
        const delay = this.baseDelay * Math.pow(2, attempt - 1); // exponential backoff
        await new Promise(resolve => setTimeout(resolve, delay));
        return this.retryWithBackoff(operation, retries, attempt + 1);
      }
      throw error;
    }
  }

  /**
   * @throws {FuseApiException}
   */
  private handleApiError(error: any): never {
    if (error instanceof AxiosError && error.response) {
      const status = error.response.status;
      const message = error.response.data?.message || 'External API error';
      throw new FuseApiException(message, status);
    }
    
    throw new FuseApiException();
  }
}