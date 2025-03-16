import { Response } from "express";

import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from "@nestjs/common";

type ResponseError = {
  errorMessage: string;
  errorId: string;
};

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let error: ResponseError = {
      errorMessage: "Internal server error",
      errorId: "internal_server_error",
    };

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      error = exception.getResponse() as ResponseError;
    }

    response.status(status).json({
      error: {
        ...error,
        statusCode: status,
      },
    });
  }
}
