import { Test, TestingModule } from '@nestjs/testing';

import { StocksController } from 'src/stocks/stocks.controller';
import { StocksService } from 'src/stocks/stocks.service';

describe('StocksController', () => {
  let controller: StocksController;
  let service: StocksService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StocksController],
      providers: [
        {
          provide: StocksService,
          useValue: {
            getStocks: jest.fn()
          },
        },
      ],
    }).compile();

    controller = module.get<StocksController>(StocksController);
    service = module.get<StocksService>(StocksService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call getStocks on the service', async () => {
    const nextToken = 'someToken';
    await controller.getStocks(nextToken);
    expect(service.getStocks).toHaveBeenCalledWith(nextToken);
  });
});