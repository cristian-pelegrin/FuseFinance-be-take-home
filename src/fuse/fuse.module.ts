import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';

import { FuseApiService } from './fuse-api/fuse-api.service';

@Module({
  imports: [HttpModule, ConfigModule],
  providers: [FuseApiService],
  exports: [FuseApiService],
})
export class FuseModule {}
