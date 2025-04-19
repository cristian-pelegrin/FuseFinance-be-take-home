import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { HoldingsService } from 'src/holdings/holdings.service';
import { HoldingsController } from 'src/holdings/holdings.controller';
import { Holding } from 'src/holdings/entities/holding.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Holding])],
  controllers: [HoldingsController],
  providers: [HoldingsService],
})
export class HoldingsModule {}
