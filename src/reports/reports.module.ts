import { Module } from '@nestjs/common';

import { TransactionsModule } from 'src/transactions/transactions.module';
import { ReportsService } from 'src/reports/reports.service';
import { SmtpMailerService } from 'src/reports/mailer/smpt.mailer.service';
import { MailerService } from 'src/reports/mailer/mailer.interface';
import { ConfigModule } from '@nestjs/config';
@Module({
  imports: [
    ConfigModule,
    TransactionsModule
  ],
  providers: [
    ReportsService,
    {
      provide: MailerService,
      useClass: SmtpMailerService,
    },
  ],
})
export class ReportsModule {}