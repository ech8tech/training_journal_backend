import { Response } from "express";

import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from "@nestjs/common";

export class BusinessException extends HttpException {
  constructor(
    public readonly errorId: string,
    public readonly message: string,
    status: HttpStatus = HttpStatus.BAD_REQUEST,
  ) {
    super({ errorId, message }, status);
  }
}

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse() as {
      errorId: string;
      message: string;
    };

    response.status(status).json({
      statusCode: status,
      errorId: exceptionResponse.errorId,
      message: exceptionResponse.message,
    });
  }
}
