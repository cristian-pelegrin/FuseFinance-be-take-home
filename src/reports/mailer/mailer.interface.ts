export abstract class AbstractMailerService {
    abstract sendReportEmail(to: string, subject: string, body: string, isHtml?: boolean): Promise<void>;
}