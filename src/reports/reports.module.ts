import { Module } from '@nestjs/common';

import { TransactionsModule } from 'src/transactions/transactions.module';
import { ReportsService } from 'src/reports/reports.service';
import { TestMailerService } from 'src/reports/mailer/test.mailer.service';
import { ProductionMailerService } from 'src/reports/mailer/production.mailer.service';
import { AbstractMailerService } from 'src/reports/mailer/mailer.interface';

@Module({
  imports: [TransactionsModule],
  providers: [
    ReportsService,
    {
      provide: AbstractMailerService,
      useClass: process.env.NODE_ENV === 'production' 
        ? ProductionMailerService 
        : TestMailerService,
    },
  ],
})
export class ReportsModule {}