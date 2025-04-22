import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { HoldingsService } from 'src/holdings/holdings.service';
import { Holding } from 'src/holdings/entities/holding.entity';
import { HoldingResponseDto } from 'src/holdings/dtos/holding-response.dto';

describe('HoldingsService', () => {
  let service: HoldingsService;
  let holdingRepo: Repository<Holding>;

  const mockHoldings: HoldingResponseDto[] = [
    { id: 1, symbol: 'AAPL', quantity: 50, avgPrice: 150, lastUpdated: new Date() },
    { id: 2, symbol: 'GOOGL', quantity: 20, avgPrice: 1000, lastUpdated: new Date() },
  ];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HoldingsService,
        {
          provide: getRepositoryToken(Holding),
          useValue: {
            find: jest.fn().mockResolvedValue(mockHoldings),
          },
        },
      ],
    }).compile();

    service = module.get<HoldingsService>(HoldingsService);
    holdingRepo = module.get<Repository<Holding>>(getRepositoryToken(Holding));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return all holdings', async () => {
    const result = await service.findAll();
    expect(result).toEqual(mockHoldings);
    expect(holdingRepo.find).toHaveBeenCalledWith({ order: { symbol: 'ASC' } });
  });
});
