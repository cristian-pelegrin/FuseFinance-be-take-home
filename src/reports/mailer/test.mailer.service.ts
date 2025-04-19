import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

import { AbstractMailerService } from 'src/reports/mailer/mailer.interface';

@Injectable()
export class TestMailerService extends AbstractMailerService {
  private readonly logger = new Logger(TestMailerService.name);
  private transporter: nodemailer.Transporter;

  constructor() {
    super();
    this.createLocalTransporter();
  }

  private async createLocalTransporter() {
    const testAccount = await nodemailer.createTestAccount();

    this.transporter = nodemailer.createTransport({
      host: testAccount.smtp.host,
      port: testAccount.smtp.port,
      secure: testAccount.smtp.secure,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });

    this.logger.log(`Ethereal test account created: ${testAccount.user}`);
  }

  async sendReportEmail(to: string, subject: string, body: string, isHtml = false): Promise<void> {
    const message = {
      from: '"Reports" <reports@test.local>',
      to,
      subject,
      ...(isHtml ? { html: body } : { text: body }),
    };

    const info = await this.transporter.sendMail(message);
    this.logger.log(`Email sent: ${info.messageId}`);
    this.logger.log(`Preview URL: ${nodemailer.getTestMessageUrl(info)}`);
  }
}