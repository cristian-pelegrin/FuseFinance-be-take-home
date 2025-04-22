import { Test, TestingModule } from '@nestjs/testing';

import { HoldingsController } from 'src/holdings/holdings.controller';
import { HoldingsService } from 'src/holdings/holdings.service';

describe('HoldingsController', () => {
  let controller: HoldingsController;
  let service: HoldingsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HoldingsController],
      providers: [
        {
          provide: HoldingsService,
          useValue: {
            findAll: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<HoldingsController>(HoldingsController);
    service = module.get<HoldingsService>(HoldingsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call findAll on the service', async () => {
    await controller.findAll();
    expect(service.findAll).toHaveBeenCalled();
  });
});
