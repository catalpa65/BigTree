import { TypeOrmModuleOptions } from "@nestjs/typeorm";

export const databaseConfig: TypeOrmModuleOptions = {
  type: "mysql",
  host: "180.106.80.34",
  port: 3306,
  username: "root",
  password: "hn02le.34lkdLKD99", // 请替换为你的数据库密码
  database: "content_db", // 请替换为你的数据库名
  entities: [__dirname + "/../**/*.entity{.ts,.js}"],
  synchronize: true, // 开发环境可以用，生产环境建议改为false
  logging: true,
};
