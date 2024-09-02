import { ArgumentsHost, Catch } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';

@Catch()
export class AllExceptionsFilter extends BaseExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const regex = /\(([^)]+)\)/;
    const matches = exception.detail?.match(regex);
    const field = matches?.[1] || 'campo';
    // em prod, o banco é postgres, enquanto em dev é mysql
    // tratando ambos, porém em dev o field é sempre 'campo'
    if (exception.code === 'ER_DUP_ENTRY' || exception.code === '23505') {
      return response.status(409).json({
        statusCode: 409,
        message: [`Este ${field} já está sendo utilizado.`],
      });
    } else if (
      exception.code === 'ER_NO_REFERENCED_ROW_2' ||
      exception.code === '23503'
    ) {
      return response.status(400).json({
        statusCode: 400,
        message: [`Este ${field} não existe.`],
      });
    }

    super.catch(exception, host);
  }
}
