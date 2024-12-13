import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Users } from './users.entity';
import { Scores } from 'src/entity/scores.entity';
import { SearchUsersDto } from './dto/search-user.dto';
import { CreateScoreDto } from './dto/score.dto';
import { CreateUserDto } from './dto/users.dto';
import { Response } from 'express';
import * as ExcelJS from 'exceljs';
import * as stream from 'stream';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users)
    private userRepository: Repository<Users>,
    @InjectRepository(Scores)
    private scoreRepository: Repository<Scores>,
  ) {}
  // 查询用户列表
  async findAll(searchUserDto: SearchUsersDto) {
    const { pageNum, pageSize, ageStart, ageEnd } = searchUserDto;
    const query = this.userRepository.createQueryBuilder('user');

    if (ageStart) {
      query.andWhere('user.age >= :ageStart', { ageStart: ageStart });
    }

    if (ageEnd) {
      query.andWhere('user.age <= :ageEnd', { ageEnd: ageEnd });
    }

    const [data, total] = await query
      .skip((pageNum - 1) * pageSize) // 计算跳过的数据条数
      .take(pageSize) // 每页返回的数量
      .getManyAndCount();

    return {
      dataList: data,
      total,
      pageNum,
      pageSize,
    };
  }

  // 下载用户文件
  async downloadUser(ageStart, ageEnd, res: Response): Promise<void> {
    const query = this.userRepository.createQueryBuilder('user');

    if (ageStart) {
      query.andWhere('user.age >= :ageStart', { ageStart: ageStart });
    }

    if (ageEnd) {
      query.andWhere('user.age <= :ageEnd', { ageEnd: ageEnd });
    }

    const data = await query.getMany();
    if (!data?.length) {
      return null;
    }

    const workBook = new ExcelJS.Workbook();
    const sheet = workBook.addWorksheet('User');

    sheet.columns = [
      { header: 'ID', key: 'id', width: 10 },
      { header: 'Name', key: 'name', width: 30 },
      { header: 'Age', key: 'age', width: 10 },
    ];

    data.forEach((item) => sheet.addRow(item));

    res.setHeader('Content-Type', 'application/octet-stream');
    res.setHeader('Content-Disposition', `attachment; filename=users_age.xlsx`);

    await workBook.xlsx.write(res);
    res.end();
  }

  // 下载用户文件【大文件，不占用内存，流式处理】
  async downloadUserStreamCsv(ageStart, ageEnd, res: Response): Promise<void> {
    const BATCH_SIZE = 10000; // 每次加载的记录数
    let offset = 0;
    let isLastBatch = false;

    res.setHeader('Content-Type', 'application/octet-stream');
    res.setHeader('Content-Disposition', `attachment; filename=users_age.csv`);

    const passThrough = new stream.PassThrough();
    passThrough.pipe(res);

    // 写入 CSV 头部
    passThrough.write('ID,Name,Age,Email,Password,Math,Chinese,English\n');

    while (!isLastBatch) {
      const query = this.userRepository
        .createQueryBuilder('user')
        .leftJoinAndSelect('user.score', 'score');
      if (ageStart) query.andWhere('user.age >= :ageStart', { ageStart });
      if (ageEnd) query.andWhere('user.age <= :ageEnd', { ageEnd });

      query.select([
        'user.id',
        'user.name',
        'user.email',
        'user.age',
        'user.password',
        'score.math',
        'score.chinese',
        'score.english',
      ]);
      query.skip(offset).take(BATCH_SIZE);

      const data = await query.getMany();

      if (data.length < BATCH_SIZE) {
        isLastBatch = true;
      }

      // 写入数据到流
      for (const user of data) {
        const csvRow = `${user.id},${user.name},${user.age},${user.email},${user.password},${user?.score.math},${user?.score.chinese},${user?.score.english}\n`;
        passThrough.write(csvRow);
      }

      offset += BATCH_SIZE;
    }

    passThrough.end(); // 结束流
  }

  // 查询用户信息，用户爱好信息
  async findUserWithHobbies(id: number): Promise<any> {
    return this.userRepository.findOne({
      where: { id: id },
      relations: ['hobbies'],
    });
  }

  // 查询用户信息，用户考试信息
  async findUserWithScore(id: number): Promise<any> {
    // 查询用户及分数
    return this.userRepository.findOne({
      where: { id },
      relations: ['score'],
    });
  }

  // 查某一用户
  findOne(id: number): Promise<Users> {
    return this.userRepository.findOneBy({ id });
  }

  // 创建用户
  create(createUserDto: CreateUserDto): Promise<Users> {
    return this.userRepository.save(createUserDto);
  }

  // 创建用户，用户考试成绩
  async createUserWidthScore(createUserDto: CreateUserDto) {
    const { score, ...userData } = createUserDto;
    const queryRunner =
      this.userRepository.manager.connection.createQueryRunner();
    await queryRunner.startTransaction();

    try {
      // 用户表
      const user = this.userRepository.create(userData);
      const createdUser = await queryRunner.manager.save(Users, user);

      // 分数表
      const scoreData = {
        ...score,
        user_id: createdUser.id,
      };
      await queryRunner.manager.save(Scores, scoreData);

      // 提交事务
      await queryRunner.commitTransaction();
      return createdUser;
    } catch (err) {
      // 出错，回滚事务
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      // 释放查询运行器
      await queryRunner.release();
    }
  }

  // 更新用户
  async update(id: number, user: Partial<Users>): Promise<Users> {
    await this.userRepository.update(id, user);
    return this.findOne(id);
  }

  // 删除用户
  async remove(id: number): Promise<void> {
    await this.userRepository.delete(id);
  }
}
