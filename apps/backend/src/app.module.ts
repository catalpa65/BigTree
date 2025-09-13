import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { databaseConfig } from "./config/database.config";
import { LoggerMiddleware } from "./logger.middleware";
import { PunchRecordModule } from "./punch-record/punch-record.module";
import { UserModule } from "./user/user.module";

@Module({
  imports: [
    UserModule,
    TypeOrmModule.forRoot(databaseConfig),
    PunchRecordModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes("user", "punch-record");
  }
}
