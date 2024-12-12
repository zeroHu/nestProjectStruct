import { PaginationDto } from 'src/common/pagination/pagination.dto';
import { IsOptional } from 'class-validator';

export class SearchUsersDto extends PaginationDto {
  @IsOptional() // 可选参数
  ageStart?: number; // 年龄开始参数

  @IsOptional() // 可选参数
  ageEnd?: number; // 年龄结束参数
}
