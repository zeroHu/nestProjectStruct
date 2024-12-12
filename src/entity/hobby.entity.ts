import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Users } from '../users/users.entity';

@Entity('big_data_test_hobby')
export class Hobby {
  @PrimaryGeneratedColumn()
  id: number; // id

  @Column()
  hobby: number; // 爱好ID

  @ManyToOne(() => Users, (user) => user.hobbies, { onDelete: 'CASCADE' }) // 多对一
  @JoinColumn({ name: 'user_id' }) // 指定数据库中的外键列名
  user: Users; // 外键
}
