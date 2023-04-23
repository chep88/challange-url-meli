import { NotFoundException } from '@nestjs/common';

export class UrlExceptions extends NotFoundException {
  constructor(message?: string, logMessage?: string, success?: boolean) {
    const responseObject = {
      success: success,
      message: message || 'No se encontró Url Solicitada',
    };

    if (logMessage) {
      console.error(logMessage);
    }

    super(responseObject);
  }
}
