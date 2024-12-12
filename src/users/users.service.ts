import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Users } from './users.entity';
import { SearchUsersDto } from './dto/search-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users)
    private userRepository: Repository<Users>,
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

  async findUserWithHobbies(id: number): Promise<any> {
    return this.userRepository.findOne({
      where: { id: id },
      relations: ['hobbies'],
    });
  }

  async findUserWithScore(id: number): Promise<any> {
    // 查询用户及分数
    return this.userRepository.findOne({
      where: { id },
      relations: ['score'],
    });
  }

  findOne(id: number): Promise<Users> {
    return this.userRepository.findOneBy({ id });
  }

  create(user: Partial<Users>): Promise<Users> {
    return this.userRepository.save(user);
  }

  async update(id: number, user: Partial<Users>): Promise<Users> {
    await this.userRepository.update(id, user);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.userRepository.delete(id);
  }
}
