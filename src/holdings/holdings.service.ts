import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Holding } from 'src/holdings/entities/holding.entity';
import { HoldingResponseDto } from 'src/holdings/dtos/holding-response.dto';
@Injectable()
export class HoldingsService {
    constructor(
        @InjectRepository(Holding)
        private holdingRepo: Repository<Holding>,
    ) {}

    async findAll(): Promise<HoldingResponseDto[]> {
        const result = await this.holdingRepo.find({
            order: { symbol: 'ASC' },
        });
        return result;
    }
}
