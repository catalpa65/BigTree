import { TypeOrmModuleOptions } from "@nestjs/typeorm";

export const databaseConfig: TypeOrmModuleOptions = {
  type: "postgres",
  url: process.env.DATABASE_URL || process.env.POSTGRES_URL,
  host: process.env.POSTGRES_HOST || process.env.PGHOST,
  port: parseInt(process.env.POSTGRES_PORT || "5432"),
  username: process.env.POSTGRES_USER || process.env.PGUSER,
  password: process.env.POSTGRES_PASSWORD || process.env.PGPASSWORD,
  database: process.env.POSTGRES_DATABASE || process.env.PGDATABASE,
  entities: [__dirname + "/../**/*.entity{.ts,.js}"],
  synchronize: true, // 开发环境可以用，生产环境建议改为false
  logging: true,
  ssl: {
    rejectUnauthorized: false, // Vercel/Neon requires SSL
  },
};
