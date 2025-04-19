import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

import { AbstractMailerService } from 'src/reports/mailer/mailer.interface';

@Injectable()
export class ProductionMailerService extends AbstractMailerService {
  private readonly logger = new Logger(ProductionMailerService.name);
  private transporter: nodemailer.Transporter;

  constructor() {
    super();
    this.createTransporter();
  }

  private createTransporter() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587', 10),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  async sendReportEmail(to: string, subject: string, body: string, isHtml = false): Promise<void> {
    const message = {
      from: process.env.SMTP_FROM || '"Reports" <reports@example.com>',
      to,
      subject,
      ...(isHtml ? { html: body } : { text: body }),
    };

    const info = await this.transporter.sendMail(message);
    this.logger.log(`Email sent: ${info.messageId}`);
  }
} 