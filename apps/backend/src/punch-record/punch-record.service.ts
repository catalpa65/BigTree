import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreatePunchRecordDto } from "./dto/create-punch-record.dto";
import { PunchRecord } from "./entities/punch-record.entity";

@Injectable()
export class PunchRecordService {
  constructor(
    @InjectRepository(PunchRecord)
    private punchRecordRepository: Repository<PunchRecord>,
  ) {}

  // 打卡
  async create(createPunchRecordDto: CreatePunchRecordDto) {
    const { userId } = createPunchRecordDto;

    // 检查今天是否已经打卡
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const existingRecord = await this.punchRecordRepository
      .createQueryBuilder("punch")
      .where("punch.userId = :userId", { userId })
      .andWhere("punch.punchTime >= :today", { today })
      .andWhere("punch.punchTime < :tomorrow", { tomorrow })
      .getOne();

    if (existingRecord) {
      throw new Error("今天已经打过卡了");
    }

    // 创建打卡记录
    const punchRecord = this.punchRecordRepository.create({
      userId,
      punchTime: new Date(),
    });

    const saved = await this.punchRecordRepository.save(punchRecord);

    return {
      message: "打卡成功",
      data: saved,
    };
  }

  // 获取用户打卡记录
  async findByUserId(userId: number) {
    const records = await this.punchRecordRepository.find({
      where: { userId },
      order: { punchTime: "DESC" },
    });

    return {
      message: "获取打卡记录成功",
      data: records,
    };
  }
}
