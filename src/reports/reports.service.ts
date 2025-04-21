import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import * as dayjs from 'dayjs';

import { MailerService } from 'src/reports/mailer/mailer.interface';
import { TransactionsService } from 'src/transactions/transactions.service';
import { Transaction } from 'src/transactions/entities/transaction.entity';

@Injectable()
export class ReportsService {
  private readonly logger = new Logger(ReportsService.name);

  constructor(
    private readonly mailerService: MailerService,
    private readonly transactionsService: TransactionsService,
  ) {}

  @Cron(CronExpression.EVERY_10_SECONDS)
  async handleDailyReport() {
    this.logger.log('Generating daily transaction report...');
    
    const transactions = await this.getYesterdayTransactions();
    const report = this.buildEmailBody(transactions);

    await this.mailerService.sendReportEmail(
      'recipient@example.com',
      'Daily Transaction Report',
      report,
      true // Enable HTML formatting
    );
  }

  private async getYesterdayTransactions(): Promise<Transaction[]> {
    const start = dayjs().subtract(0, 'day').startOf('day').toDate();
    const end = dayjs().subtract(0, 'day').endOf('day').toDate();

    return this.transactionsService.getTransactionsInRange(start, end);
  }

  private buildEmailBody(transactions: Transaction[]): string {
    const total = transactions.length;
    const success = transactions.filter(t => t.status === 'success').length;
    const failed = transactions.filter(t => t.status === 'failed').length;

    const tableRows = transactions.map(t => `
      <tr>
        <td>${t.symbol}</td>
        <td>${t.quantity}</td>
        <td>${t.price}</td>
        <td>${t.status}</td>
        <td>${t.createdAt.toISOString()}</td>
      </tr>
    `).join('');

    return `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            table {
              border-collapse: collapse;
              width: 100%;
              margin-top: 20px;
            }
            th, td {
              border: 1px solid #ddd;
              padding: 8px;
              text-align: left;
            }
            th {
              background-color: #f2f2f2;
            }
            tr:nth-child(even) {
              background-color: #f9f9f9;
            }
            .summary {
              margin-bottom: 20px;
            }
          </style>
        </head>
        <body>
          <h2>Daily Transaction Report</h2>
          <div class="summary">
            <p><strong>Total:</strong> ${total}</p>
            <p><strong>Success:</strong> ${success}</p>
            <p><strong>Failed:</strong> ${failed}</p>
          </div>
          <table>
            <thead>
              <tr>
                <th>Symbol</th>
                <th>Quantity</th>
                <th>Price</th>
                <th>Status</th>
                <th>Created At</th>
              </tr>
            </thead>
            <tbody>
              ${tableRows}
            </tbody>
          </table>
        </body>
      </html>
    `;
  }
}
