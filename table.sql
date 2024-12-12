-- 大用户表big_data_test
create table `big_data_test` (
    `id` int not null auto_increment comment '主键',
    `name` varchar(50) default  '' comment  '用户名',
    `email` varchar(50) not null comment  '邮箱',
    `phone` varchar(20) default '' comment  '手机号',
    `gender` tinyint default  '0' comment '性别：0-男，1-女',
    `password` VARCHAR(100) NOT NULL COMMENT '密码',
    `age` tinyint default '0' comment '年龄',
    `create_time` datetime default  now(),
    `update_time` datetime default now(),
    primary key (`id`)
)engine = innodb default charset  = utf8 comment '大数据测试用户表';

-- big_data_test 测试数据函数生成
SET GLOBAL log_bin_trust_function_creators=TRUE; -- 创建函数一定要写这个
DELIMITER $$

create function mock_big_data_test()
returns  int
begin
    declare num int default 1000000;
    declare i int default 0;

    while i<num DO
        INSERT INTO big_data_test(`name`,`email`,`phone`,`gender`,`password`,`age`)
	    VALUES(CONCAT('用户',i),'2548928007qq.com',CONCAT('18',FLOOR(RAND() * ((999999999 - 100000000) + 1000000000))),FLOOR(RAND()  *  2),UUID(),FLOOR(RAND()  *  100));
	    SET i =  i + 1;	-- i自增
    end while;
    RETURN i;
end;


create table `big_data_test_score` (
    `id` int not null auto_increment comment '主键',
    `user_id` varchar(50) default  '' comment  '用户名',
    `math` int default null comment '数学分数',
    `chinese` int default null comment '语文分数',
    `english` int default null comment '英语分数',
    `create_time` datetime default  now(),
    `update_time` datetime default now(),
    primary key (`id`)
)engine = innodb default charset  = utf8 comment '大数据测试用户成绩表';


SET GLOBAL log_bin_trust_function_creators=TRUE; -- 创建函数一定要写这个
DELIMITER $$
create function mock_big_data_test_score()
returns  int
begin
    declare num int default 1000000;
    declare i int default 1;

    while i<num DO
        INSERT INTO big_data_test_score(`user_id`,`math`,`chinese`,`english`)
        VALUES (i,
                FLOOR(RAND() * 100),
                FLOOR(RAND() * 100),
                FLOOR(RAND() * 100)
        );
	    SET i =  i + 1;	-- i自增
    end while;
    RETURN i;
end;


create table `big_data_test_hobby` (
    `id` int not null auto_increment comment '主键',
    `user_id` varchar(50) default  '' comment  '用户名',
    `hobby` int default null comment '爱好',
    `create_time` datetime default  now(),
    `update_time` datetime default now(),
    primary key (`id`)
)engine = innodb default charset  = utf8 comment '大数据测试用户爱好';


SET GLOBAL log_bin_trust_function_creators=TRUE; -- 创建函数一定要写这个
DELIMITER $$
create function mock_big_data_test_hobby()
returns  int
begin
    declare num int default 10000;
    declare i int default 1;

    while i<num DO
        INSERT INTO big_data_test_hobby(`user_id`,`hobby`)
        VALUES (i,
                FLOOR(RAND() * 100)
        );
	    SET i =  i + 1;	-- i自增
    end while;
    RETURN i;
end;