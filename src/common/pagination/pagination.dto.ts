import { IsInt, IsOptional, Min, Max, IsPositive } from 'class-validator';

export class PaginationDto {
  @IsOptional() // 可选参数
  // @IsInt() // 必须是整数
  // @IsPositive() // 必须是正数
  // @Min(1) // 最小值为 1
  pageNum?: number = 1; // 默认值为 1

  @IsOptional() // 可选参数
  // @IsInt() // 必须是整数
  // @IsPositive() // 必须是正数
  // @Min(1) // 最小值为 1
  // @Max(100) // 最大值为 100
  pageSize?: number = 10; // 默认值为 10
}
