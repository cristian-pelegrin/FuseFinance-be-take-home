import { Controller } from '@nestjs/common';
import { HoldingsService } from './holdings.service';

@Controller('holdings')
export class HoldingsController {
  constructor(private readonly holdingsService: HoldingsService) {}
}
