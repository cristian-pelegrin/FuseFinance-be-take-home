import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';

import { ReportsService } from 'src/reports/reports.service';
import { MailerService } from 'src/reports/mailer/mailer.interface';
import { TransactionsService } from 'src/transactions/transactions.service';
import { Transaction } from 'src/transactions/entities/transaction.entity';

describe('ReportsService', () => {
  let service: ReportsService;
  let mailerService: MailerService;
  let transactionsService: TransactionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReportsService,
        {
          provide: MailerService,
          useValue: {
            sendReportEmail: jest.fn().mockResolvedValue(true),
          },
        },
        {
          provide: TransactionsService,
          useValue: {
            getTransactionsInRange: jest.fn().mockResolvedValue([
              { symbol: 'AAPL', quantity: 10, price: 150, status: 'success', createdAt: new Date() },
              { symbol: 'GOOGL', quantity: 5, price: 1000, status: 'failed', createdAt: new Date() },
            ] as Transaction[]),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockImplementation((key) => {
              if (key === 'EMAIL_REPORT_RECIPIENT') {
                return 'test@test.com';
              }
              return undefined;
            }),
          },
        },
      ],
    }).compile();

    service = module.get<ReportsService>(ReportsService);
    mailerService = module.get<MailerService>(MailerService);
    transactionsService = module.get<TransactionsService>(TransactionsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should generate and send a daily report', async () => {
    await service.handleDailyReport();

    expect(transactionsService.getTransactionsInRange).toHaveBeenCalled();
    expect(mailerService.sendReportEmail).toHaveBeenCalledWith(
      'test@test.com',
      'Daily Transaction Report',
      expect.stringContaining('<h2>Daily Transaction Report</h2>'),
      true
    );
  });
});
