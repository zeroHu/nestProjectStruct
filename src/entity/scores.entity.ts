import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Users } from '../users/users.entity';

@Entity('big_data_test_score')
export class Scores {
  @PrimaryGeneratedColumn()
  id: number; // 主键 - id

  @Column()
  user_id: number; // 外键 - 用户id

  @Column()
  math: number; // 数学

  @Column()
  chinese: number; // 语文

  @Column()
  english: number; // 英语

  @OneToOne(() => Users, (user) => user.score, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' }) //外键列名
  user: Users;
}
