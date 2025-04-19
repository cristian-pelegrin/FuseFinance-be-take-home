import { Controller, Get } from '@nestjs/common';

import { HoldingsService } from 'src/holdings/holdings.service';
import { HoldingResponseDto } from 'src/holdings/dtos/holding-response.dto';

@Controller('holdings')
export class HoldingsController {
  constructor(private readonly holdingsService: HoldingsService) {}

  @Get()
  async findAll(): Promise<HoldingResponseDto[]> {
    return this.holdingsService.findAll();
  }
}
