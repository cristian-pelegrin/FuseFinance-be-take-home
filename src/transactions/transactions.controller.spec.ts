import { Test, TestingModule } from '@nestjs/testing';

import { TransactionsController } from 'src/transactions/transactions.controller';
import { TransactionsService } from 'src/transactions/transactions.service';

describe('TransactionsController', () => {
  let controller: TransactionsController;
  let service: TransactionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TransactionsController],
      providers: [
        {
          provide: TransactionsService,
          useValue: {
            buyStock: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<TransactionsController>(TransactionsController);
    service = module.get<TransactionsService>(TransactionsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call buyStock on the service', async () => {
    const transactionDto = { symbol: 'AAPL', quantity: 10, price: 150 };
    await controller.buy(transactionDto);
    expect(service.buyStock).toHaveBeenCalledWith(transactionDto);
  });
});
