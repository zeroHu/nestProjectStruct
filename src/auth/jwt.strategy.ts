import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // 从 Authorization Header 中提取 Token
      ignoreExpiration: false, // 是否忽略过期
      secretOrKey: 'your_jwt_secret', // 对应于 JWT 模块配置的秘钥
    });
  }

  async validate(payload: any) {
    return { userId: payload.sub, username: payload.username };
  }
}
