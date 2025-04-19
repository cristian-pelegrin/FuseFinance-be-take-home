import { Test, TestingModule } from '@nestjs/testing';
import { FuseApiService } from './fuse-api.service';

describe('FuseApiService', () => {
  let service: FuseApiService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FuseApiService],
    }).compile();

    service = module.get<FuseApiService>(FuseApiService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
