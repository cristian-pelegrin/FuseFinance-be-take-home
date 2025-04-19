import { HttpException, HttpStatus } from '@nestjs/common';

export class FuseApiException extends HttpException {
  constructor(
    message: string = 'External API error',
    status: number = HttpStatus.INTERNAL_SERVER_ERROR,
  ) {
    super(
      {
        status,
        message,
      },
      status,
    );
  }
} 