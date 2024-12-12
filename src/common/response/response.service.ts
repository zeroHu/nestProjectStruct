import { Injectable, Global } from '@nestjs/common';
import { ApiResponse } from './response.interface';

@Global()
@Injectable()
export class ResponseService {
  success<T>(data: T, message: string = '请求成功'): ApiResponse<T> {
    return {
      code: 200,
      message,
      data,
    };
  }

  failure(message: string = '内部错误'): ApiResponse<null> {
    return {
      code: 500,
      message,
      data: null,
    };
  }

  unauthorized(message: string = '您没有权限'): ApiResponse<null> {
    return {
      code: 401,
      message,
      data: null,
    };
  }
}
