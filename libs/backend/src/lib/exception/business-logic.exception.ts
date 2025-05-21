// business.exception.ts
import { HttpException, HttpStatus } from '@nestjs/common';

export class BusinessLogicException extends HttpException {
  constructor(message: string, public readonly errorCode: string = 'BUSINESS_LOGIC_ERROR') {
    super(message, HttpStatus.OK);
  }
}
