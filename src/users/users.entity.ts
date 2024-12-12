import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { Hobby } from '../entity/hobby.entity';
import { Scores } from '../entity/scores.entity';

@Entity('big_data_test')
export class Users {
  @PrimaryGeneratedColumn()
  id: number; // id

  @Column()
  name: string; // 姓名

  @Column()
  email: string; // 邮箱

  @Column()
  password: string; // 密码

  @Column()
  age: number; // 年龄

  // 爱好，一对多
  @OneToMany(() => Hobby, (hobby) => hobby.user)
  hobbies: Hobby[];

  // 成绩, 一对一
  @OneToOne(() => Scores, (score) => score.user)
  score: Scores;
}
