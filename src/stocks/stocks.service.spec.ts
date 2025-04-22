import { Test, TestingModule } from '@nestjs/testing';
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';

import { StocksService } from 'src/stocks/stocks.service';
import { FuseApiService } from 'src/fuse/fuse-api/fuse-api.service';
import { StockResponseDto } from 'src/stocks/dtos/stock-response.dto';

describe('StocksService', () => {
  let service: StocksService;
  let fuseApiService: FuseApiService;
  let cacheManager: Cache;

  const mockStockResponse: StockResponseDto = {
    items: [
      {
        lastUpdated: "2025-04-22T03:15:10.706Z",
        change: 0,
        price: 0.25,
        name: "NVIDIA Corporation",
        sector: "Technology",
        symbol: "NVDA"
      },
      {
          lastUpdated: "2025-04-22T03:15:10.708Z",
          change: 0,
          price: 0.25,
          name: "UnitedHealth Group Inc.",
          sector: "Healthcare",
          symbol: "UNH"
      }
    ],
    "nextToken": "eyJzeW1ib2wiOiJDU0NPIn0="
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StocksService,
        {
          provide: FuseApiService,
          useValue: {
            getStocks: jest.fn().mockResolvedValue({
              data: {
                data: mockStockResponse,
              },
            }),
          },
        },
        {
          provide: CACHE_MANAGER,
          useValue: {
            get: jest.fn().mockResolvedValue(null),
            set: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<StocksService>(StocksService);
    fuseApiService = module.get<FuseApiService>(FuseApiService);
    cacheManager = module.get<Cache>(CACHE_MANAGER);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return stock data on success', async () => {
    const nextToken = 'someToken';
    const result: StockResponseDto = await service.getStocks(nextToken);

    expect(result).toEqual(mockStockResponse);
    expect(fuseApiService.getStocks).toHaveBeenCalledWith(nextToken, 3);
    expect(cacheManager.set).toHaveBeenCalled();
  });
});
