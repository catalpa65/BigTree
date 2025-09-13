import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 启用全局验证管道
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // 自动过滤掉DTO中没有定义的属性
      forbidNonWhitelisted: true, // 如果有额外属性则报错
      transform: true, // 自动转换类型
    })
  );

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap().catch((error) =>
  console.error("Application failed to start", error)
);
