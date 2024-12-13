import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  Query,
  UsePipes,
  ValidationPipe,
  Res,
} from '@nestjs/common';

import { Response } from 'express';
import { UsersService } from './users.service';
import { Users } from './users.entity';
import { CreateUserDto } from './dto/users.dto';

import { ResponseService } from '../common/response/response.service';
import { ApiResponse } from '../common/response/response.interface';
import { SearchUsersDto } from './dto/search-user.dto';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly responseService: ResponseService,
  ) {}

  // 查询用户列表
  @Get()
  @UsePipes(new ValidationPipe({ transform: true })) // 使用 ValidationPipe 进行校验
  async findAll(@Query() searchUserDto: SearchUsersDto) {
    const data = await this.usersService.findAll(searchUserDto);
    return this.responseService.success(data);
  }

  // 下载用户
  @Get('/download')
  async downloadUser(
    @Query('ageStart') ageStart: string,
    @Query('ageEnd') ageEnd: string,
    @Res() res: Response,
  ) {
    // 参数校验
    const parsedAgeStart = parseInt(ageStart, 10);
    const parsedAgeEnd = parseInt(ageEnd, 10);
    if (
      isNaN(parsedAgeEnd) ||
      parsedAgeEnd <= 0 ||
      isNaN(parsedAgeStart) ||
      parsedAgeStart <= 0
    ) {
      return this.responseService.failure('参数错误');
    }

    // 调用服务处理文件生成与下载
    await this.usersService.downloadUser(ageStart, ageEnd, res);
  }

  // 下载用户
  @Get('/download/big')
  async downloadUserStream(
    @Query('ageStart') ageStart: string,
    @Query('ageEnd') ageEnd: string,
    @Res() res: Response,
  ) {
    // 参数校验
    const parsedAgeStart = parseInt(ageStart, 10);
    const parsedAgeEnd = parseInt(ageEnd, 10);
    if (
      isNaN(parsedAgeEnd) ||
      parsedAgeEnd <= 0 ||
      isNaN(parsedAgeStart) ||
      parsedAgeStart <= 0
    ) {
      return this.responseService.failure('参数错误');
    }

    // 调用服务处理文件生成与下载
    await this.usersService.downloadUserStreamCsv(ageStart, ageEnd, res);
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<ApiResponse<Users>> {
    const data = await this.usersService.findOne(+id);
    return this.responseService.success(data);
  }

  @Get('/hobbies/:id')
  findUserWithHobbies(@Param('id') id: number): Promise<Users> {
    return this.usersService.findUserWithHobbies(+id);
  }

  @Get('/score/:id')
  findUserWithScore(@Param('id') id: number): Promise<Users> {
    return this.usersService.findUserWithScore(+id);
  }

  @Post()
  create(@Body() createUserDto: CreateUserDto): Promise<Users> {
    return this.usersService.create(createUserDto);
  }

  @Put(':id')
  update(
    @Param('id') id: number,
    @Body() updateUserDto: Partial<Users>,
  ): Promise<Users> {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number): Promise<void> {
    return this.usersService.remove(+id);
  }
}
