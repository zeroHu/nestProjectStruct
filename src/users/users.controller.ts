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

  // 下载用户, 大文件，用流的形式
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

  // 获取具体某一个用户
  @Get(':id')
  async findOne(@Param('id') id: number): Promise<ApiResponse<Users>> {
    const data = await this.usersService.findOne(+id);
    return this.responseService.success(data);
  }

  // 获取用户 & 爱好信息
  @Get('/hobbies/:id')
  findUserWithHobbies(@Param('id') id: number): Promise<Users> {
    return this.usersService.findUserWithHobbies(+id);
  }

  // 获取用户 & 分数信息
  @Get('/score/:id')
  findUserWithScore(@Param('id') id: number): Promise<Users> {
    return this.usersService.findUserWithScore(+id);
  }

  // 创建用户
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }
  // 创建用户 & 分数信息
  @Post('/withscore')
  createUserWidthScore(@Body() createUserDto: CreateUserDto) {
    return this.usersService.createUserWidthScore(createUserDto);
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
