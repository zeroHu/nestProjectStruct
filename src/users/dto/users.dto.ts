import {
  IsOptional,
  IsString,
  IsEmail,
  IsInt,
  Min,
  Max,
} from 'class-validator';
import { CreateScoreDto } from './score.dto';
export class CreateUserDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsInt()
  @Min(10)
  @Max(20)
  age: number;

  // 包含 Score 信息
  @IsOptional()
  score: CreateScoreDto;
}
