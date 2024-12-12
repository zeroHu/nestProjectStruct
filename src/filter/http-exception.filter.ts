import {
  Catch,
  ArgumentsHost,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';
import { ApiResponse } from 'src/common/response/response.interface';

// 定义统一的异常响应格式
@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse<Response>();
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse(); // 获取错误响应的内容
    // 解析错误信息
    let message = '内部错误';
    if (exceptionResponse && typeof exceptionResponse === 'object') {
      if (Array.isArray((exceptionResponse as any).message)) {
        message = (exceptionResponse as any).message[0] || '内部错误'; // 获取错误消息数组的第一条信息
      } else if ((exceptionResponse as any).message) {
        message = (exceptionResponse as any).message;
      }
    } else {
      message = String(exceptionResponse); // 如果异常响应不是对象，直接转换为字符串
    }

    // 构建统一的 API 响应结构
    const apiResponse: ApiResponse<null> = {
      code: status || 500, // 默认使用 500 错误码
      message: message, // 错误信息
      data: null, // 错误时没有数据
    };

    // 设置响应状态码和返回的 body 数据
    response.status(status || 500).json(apiResponse);
  }
}
