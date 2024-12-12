import {
  Controller,
  Post,
  Body,
  Request,
  // UseGuards,
  Get,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ResponseService } from 'src/common/response/response.service';
// import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly responseService: ResponseService,
  ) {}

  @Post('login')
  async login(@Body() body: { username: string; password: string }) {
    const user = await this.authService.validateUser(
      body.username,
      body.password,
    );
    if (!user) {
      return this.responseService.failure('Invalid credentials');
    }
    return this.authService.login(user);
  }

  // @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req: any) {
    return req.user; // JwtStrategy 中返回的用户信息
  }
}
