export abstract class MailerService {
    abstract sendReportEmail(to: string, subject: string, body: string, isHtml?: boolean): Promise<void>;
}