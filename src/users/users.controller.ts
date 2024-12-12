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
} from '@nestjs/common';

import { UsersService } from './users.service';
import { Users } from './users.entity';
import { CreateUserDto } from './dto/users.dto';

import { ResponseService } from '../common/response/response.service';
import { ApiResponse } from '../common/response/response.interface';
// import { PaginationQuery } from 'src/common/pagination/pagination.interface';
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
    console.log('searchUserDto', searchUserDto);
    const data = await this.usersService.findAll(searchUserDto);
    return this.responseService.success(data);
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
