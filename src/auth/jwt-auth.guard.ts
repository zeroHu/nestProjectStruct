import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  private readonly whiteList = [
    { path: '/auth/login', method: 'POST' }, // 登录接口
    { path: '/auth/register', method: 'POST' }, // 注册接口
    { path: '/users/download', method: 'GET' }, // 用户下载接口
    { path: '/users/download/big', method: 'GET' }, // 用户下载接口
  ];

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const { path, method } = request; // 获取请求路径
    // 如果路径和方法都在白名单中，则跳过守卫
    if (
      this.whiteList.some(
        (route) => route.path === path && route.method === method,
      )
    ) {
      return true;
    }
    // 直接将结果转换为 Promise
    return Promise.resolve(
      super.canActivate(context) as boolean | Promise<boolean>,
    );
  }
}
