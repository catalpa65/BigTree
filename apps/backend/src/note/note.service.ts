import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateNoteDto } from "./dto/create-note.dto";
import { UpdateNoteDto } from "./dto/update-note.dto";
import { Note } from "./entities/note.entity";

@Injectable()
export class NoteService {
  constructor(
    @InjectRepository(Note)
    private noteRepository: Repository<Note>
  ) {}

  /**
   * 创建新笔记
   */
  async create(createNoteDto: CreateNoteDto) {
    const note = this.noteRepository.create(createNoteDto);
    const saved = await this.noteRepository.save(note);

    return {
      message: "笔记创建成功",
      data: saved,
    };
  }

  /**
   * 获取用户所有笔记（按创建时间倒序）
   */
  async findByUserId(userId: number) {
    const notes = await this.noteRepository.find({
      where: { userId },
      order: { createTime: "DESC" },
    });

    return {
      message: "获取笔记列表成功",
      data: notes,
    };
  }

  /**
   * 根据ID获取单个笔记
   */
  async findOne(id: number, userId: number) {
    const note = await this.noteRepository.findOne({
      where: { id, userId }, // 确保只能获取自己的笔记
    });

    if (!note) {
      throw new Error("笔记不存在或无权访问");
    }

    return {
      message: "获取笔记详情成功",
      data: note,
    };
  }

  /**
   * 更新笔记
   */
  async update(id: number, userId: number, updateNoteDto: UpdateNoteDto) {
    // 验证参数格式
    if (isNaN(id) || isNaN(userId)) {
      throw new Error("笔记ID或用户ID格式无效");
    }

    // 先检查笔记是否存在且属于当前用户
    const existingNote = await this.noteRepository.findOne({
      where: { id, userId },
    });

    if (!existingNote) {
      throw new Error("笔记不存在或无权修改");
    }

    // 更新笔记
    await this.noteRepository.update(id, updateNoteDto);

    // 返回更新后的笔记
    const updatedNote = await this.noteRepository.findOne({
      where: { id },
    });

    return {
      message: "笔记更新成功",
      data: updatedNote,
    };
  }

  /**
   * 删除笔记
   */
  async remove(id: number, userId: number) {
    // 先检查笔记是否存在且属于当前用户
    const existingNote = await this.noteRepository.findOne({
      where: { id, userId },
    });

    if (!existingNote) {
      throw new Error("笔记不存在或无权删除");
    }

    await this.noteRepository.remove(existingNote);

    return {
      message: "笔记删除成功",
      data: { id },
    };
  }

  /**
   * 获取用户笔记统计信息
   */
  async getStats(userId: number) {
    const totalCount = await this.noteRepository.count({
      where: { userId },
    });

    // 获取最近7天的笔记数量
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const recentCount = await this.noteRepository.count({
      where: {
        userId,
        createTime: {
          $gte: sevenDaysAgo,
        } as any,
      },
    });

    return {
      message: "获取笔记统计成功",
      data: {
        totalCount,
        recentCount,
      },
    };
  }

  /**
   * 获取用户今天的笔记
   */
  async findTodayNote(userId: number) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const todayNote = await this.noteRepository
      .createQueryBuilder("note")
      .where("note.userId = :userId", { userId })
      .andWhere("note.createTime >= :today", { today })
      .andWhere("note.createTime < :tomorrow", { tomorrow })
      .getOne();

    return {
      message: todayNote ? "获取今日笔记成功" : "今日暂无笔记",
      data: todayNote,
    };
  }

  /**
   * 保存或更新今天的笔记（用于实时保存功能）
   * 每天只能有一条笔记记录，如果今天已有笔记则更新，否则创建新笔记
   */
  async saveOrUpdateTodayNote(userId: number, note: string) {
    // 首先查找今天是否已经有笔记
    const todayNoteResult = await this.findTodayNote(userId);
    const todayNote = todayNoteResult.data;

    if (todayNote && todayNote.id && !isNaN(todayNote.id)) {
      // 今天已有笔记且ID有效，更新它
      console.log(`更新今日笔记 ID: ${todayNote.id}, 用户: ${userId}`);

      // 添加额外的验证确保ID和用户ID都是有效数字
      if (isNaN(userId)) {
        throw new Error("用户ID格式无效");
      }

      return await this.update(todayNote.id, userId, { note });
    } else {
      // 今天没有笔记或ID无效，创建新的
      console.log(`创建新的今日笔记，用户: ${userId}`);

      // 验证用户ID
      if (isNaN(userId)) {
        throw new Error("用户ID格式无效");
      }

      return await this.create({ userId, note });
    }
  }

  /**
   * 保存或更新笔记（用于实时保存功能）
   * 如果noteId存在则更新，否则创建新笔记
   * @deprecated 建议使用 saveOrUpdateTodayNote 实现每天一条笔记的逻辑
   */
  async saveOrUpdate(userId: number, note: string, noteId?: number) {
    if (noteId) {
      // 更新现有笔记
      return await this.update(noteId, userId, { note });
    } else {
      // 创建新笔记
      return await this.create({ userId, note });
    }
  }
}
