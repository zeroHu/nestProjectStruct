import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  private readonly whiteList = [
    { path: '/auth/login', method: 'POST' }, // 登录接口
    { path: '/auth/register', method: 'POST' }, // 注册接口
  ];

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const { url, method } = request; // 获取请求路径

    // 如果路径和方法都在白名单中，则跳过守卫
    if (
      this.whiteList.some(
        (route) => route.path === url && route.method === method,
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
