import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';

import { HttpModule, HttpService } from '@nestjs/axios';
import { of } from 'rxjs';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { AppModule } from './../src/app.module';

describe('StocksController (e2e)', () => {
  let app: INestApplication;
  let httpService: HttpService;

  const mockStocks = [
    { lastUpdated: '2025-04-14T03:13:49.403Z', change: 0, price: 0.25, name: 'NVIDIA Corporation', sector: 'Technology', symbol: 'NVDA' },
    { lastUpdated: '2025-04-14T03:13:49.403Z', change: 0, price: 0.5, name: 'UnitedHealth Group Inc.', sector: 'Healthcare', symbol: 'UNH' },
    { lastUpdated: '2025-04-14T03:13:49.403Z', change: 0, price: 0.75, name: 'Boeing Co.', sector: 'Industrial', symbol: 'BA' },
  ];

  const mockApiResponse = {
    data: {
      data: {
        items: mockStocks,
        nextToken: null
      }
    }
  };

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        AppModule,
        HttpModule,
        ConfigModule.forRoot({
          isGlobal: true,
          load: [
            () => ({
              FUSE_API_URL: 'https://mock-api.example.com',
              FUSE_API_KEY: 'mock-api-key'
            })
          ]
        })
      ],
    })
      .overrideProvider(HttpService)
      .useValue({
        get: jest.fn().mockImplementation(() => of(mockApiResponse))
      })
      .compile();

    app = moduleFixture.createNestApplication();
    httpService = moduleFixture.get<HttpService>(HttpService);
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it('/stocks (GET)', () => {
    return request(app.getHttpServer())
      .get('/stocks')
      .expect(200)
      .expect((res) => {
        expect(res.body).toEqual(mockStocks);
        expect(httpService.get).toHaveBeenCalledWith(
          'https://mock-api.example.com/stocks',
          expect.objectContaining({
            headers: {
              'x-api-key': 'mock-api-key'
            },
            params: {}
          })
        );
      });
  });
});
