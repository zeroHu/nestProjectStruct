import { IsInt } from 'class-validator';

export class CreateScoreDto {
  @IsInt()
  user_id: number; // 外键 - 用户id

  @IsInt()
  math: number; // 数学

  @IsInt()
  chinese: number; // 语文

  @IsInt()
  english: number; // 英语
}
