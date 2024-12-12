import { Module } from '@nestjs/common';
// import { AppController } from './app.controller';
// import { AppService } from './app.service';

import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ResponseModule } from './common/response/response.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '1q2w3e4r',
      database: 'fine_report',
      autoLoadEntities: true, // 自动加载实体
      synchronize: false, // 开发环境使用，自动同步表结构
    }),
    UsersModule,
    AuthModule,
    ResponseModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
