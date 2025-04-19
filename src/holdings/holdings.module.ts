import { Module } from '@nestjs/common';

import { HoldingsService } from 'src/holdings/holdings.service';
import { HoldingsController } from 'src/holdings/holdings.controller';

@Module({
  controllers: [HoldingsController],
  providers: [HoldingsService],
})
export class HoldingsModule {}
