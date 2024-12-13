## 对 nest + typeOrm 的探索式开发Demo
```
结合我的开发经验，尝试写一写管理后台系统常用的接口（只体现方式，并没有去写业务逻辑接口）
```
### 功能点

- 引入swagger，自动生成文档
- jwt登录
- 单表 增删改查（get, delete, put, post) 的实现
- 多表 整，查（get, post) 的实现
- 文件下载、大文件流式下载

### 知识点
- 路由守护
- 管道
- 过滤
- 全局异常捕获
- 全局定义标准返回格式
- 多表的关联查询
- 事务
- 文件流

### 已完成API
```
users 用户表
scores 分数表
hobby 爱好表

其中 users 渝 hobby 是一对多的关系
users 与 scores 是一对一的关系
```

- users 单表的 get,post,put,delete,download
- users & scores 表的 get, post, download
- user & hobby 表的 get 
- users 表的单表下载

### 目录介绍
- ...... 免介绍
- table.sql --- 系统中用到的三张表的建表语句以及生成百万条测试数据的函数
- auth jwt涉及到登录，生成token
- users 定义了用户的相关接口
- filter 全局过滤
- entity 全局entity文件

### 运行介绍
```
1. node版本v20以上
2. 安装了mysql数据库
3. 将table.sql内容执行
4. npm run start
5. 通过 localhost:3000/docs 可以查看哪些api
6. 提前完成工作的你~~ 美美的喝杯咖啡享受生活吧【dog】
```

