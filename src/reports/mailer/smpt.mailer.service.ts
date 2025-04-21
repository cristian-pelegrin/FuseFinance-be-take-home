import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

import { MailerService } from 'src/reports/mailer/mailer.interface';

@Injectable()
export class SmtpMailerService extends MailerService {
  private readonly logger = new Logger(SmtpMailerService.name);
  private transporter: nodemailer.Transporter;

  constructor(private readonly config: ConfigService) {
    super();
    this.createTransporter();
  }

  private createTransporter() {
    this.transporter = nodemailer.createTransport({
      host: this.config.get('SMTP_HOST'),
      port: parseInt(this.config.get('SMTP_PORT') || '1025', 10),
      secure: this.config.get('SMTP_SECURE') === 'true',
      auth: this.config.get('EMAIL_USER') && this.config.get('EMAIL_PASS')
        ? {
            user: this.config.get('EMAIL_USER'),
            pass: this.config.get('EMAIL_PASS'),
          }
        : undefined,
    });
  }

  async sendReportEmail(to: string, subject: string, body: string, isHtml = false): Promise<void> {
    const message = {
      from: this.config.get('SMTP_FROM') || '"Reports" <reports@example.com>',
      to,
      subject,
      ...(isHtml ? { html: body } : { text: body }),
    };

    const info = await this.transporter.sendMail(message);
    this.logger.log(`Email sent: ${info.messageId}`);
  }
} 