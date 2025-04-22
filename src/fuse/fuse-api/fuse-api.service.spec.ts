import { Test, TestingModule } from '@nestjs/testing';
import { HttpService } from '@nestjs/axios';
import { of, throwError } from 'rxjs';
import { AxiosResponse } from 'axios';
import { ConfigService } from '@nestjs/config';

import { FuseApiService } from 'src/fuse/fuse-api/fuse-api.service';
import { FuseApiException } from 'src/fuse/exceptions/fuse-api.exception';

describe('FuseApiService', () => {
  let service: FuseApiService;
  let httpService: HttpService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FuseApiService,
        {
          provide: HttpService,
          useValue: {
            get: jest.fn(),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockImplementation((key: string) => {
              switch (key) {
                case 'FUSE_API_URL':
                  return 'http://fake-api-url.com';
                case 'FUSE_API_KEY': 
                  return 'fake-api-key';
                default:
                  return null;
              }
            }),
          },
        },
      ],
    }).compile();

    service = module.get<FuseApiService>(FuseApiService);
    httpService = module.get<HttpService>(HttpService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should retry on 500 error', async () => {
    const errorResponse = {
      response: { status: 500 },
    };
    jest.spyOn(httpService, 'get').mockReturnValue(throwError(() => errorResponse));

    await expect(service.getStocks(undefined, 3)).rejects.toThrow(FuseApiException);
    expect(httpService.get).toHaveBeenCalledTimes(3);
  });
});
