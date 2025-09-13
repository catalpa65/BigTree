import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PunchRecord } from "./entities/punch-record.entity";
import { PunchRecordController } from "./punch-record.controller";
import { PunchRecordService } from "./punch-record.service";

@Module({
  imports: [TypeOrmModule.forFeature([PunchRecord])],
  controllers: [PunchRecordController],
  providers: [PunchRecordService],
  exports: [PunchRecordService],
})
export class PunchRecordModule {}
