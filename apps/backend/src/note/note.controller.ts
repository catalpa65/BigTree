// 引入NestJS核心装饰器和HTTP相关功能
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
} from "@nestjs/common";
// 引入数据传输对象（DTO）
import { CreateNoteDto } from "./dto/create-note.dto";
import { UpdateNoteDto } from "./dto/update-note.dto";
// 引入笔记服务
import { NoteService } from "./note.service";

/**
 * 笔记控制器
 * @Controller('note') 装饰器定义了这个控制器的路由前缀
 * 所有的路由都会以 /note 开头
 */
@Controller("note")
export class NoteController {
  /**
   * 构造函数：依赖注入
   * NestJS会自动注入NoteService的实例
   */
  constructor(private readonly noteService: NoteService) {}

  /**
   * 创建新笔记的接口
   * @Post() 装饰器表示这是一个POST请求
   * 完整路由: POST /note
   */
  @Post()
  async create(@Body() createNoteDto: CreateNoteDto) {
    try {
      return await this.noteService.create(createNoteDto);
    } catch (error) {
      throw new HttpException(
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
        error.message || "创建笔记失败",
        HttpStatus.BAD_REQUEST
      );
    }
  }

  /**
   * 根据用户ID获取笔记列表的接口
   * @Get('user/:userId') 装饰器表示这是一个GET请求
   * 完整路由: GET /note/user/:userId
   */
  @Get("user/:userId")
  async findByUserId(@Param("userId") userId: string) {
    try {
      const userIdNum = +userId;

      if (isNaN(userIdNum)) {
        throw new Error("用户ID格式无效");
      }

      return await this.noteService.findByUserId(userIdNum);
    } catch (error) {
      throw new HttpException(
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
        error.message || "获取笔记列表失败",
        HttpStatus.BAD_REQUEST
      );
    }
  }

  /**
   * 获取用户今天的笔记
   * 完整路由: GET /note/today/user/:userId
   * 注意：这个路由必须放在 :id/user/:userId 之前，避免路由冲突
   */
  @Get("today/user/:userId")
  async findTodayNote(@Param("userId") userId: string) {
    try {
      const userIdNum = +userId;

      if (isNaN(userIdNum)) {
        throw new Error("用户ID格式无效");
      }

      return await this.noteService.findTodayNote(userIdNum);
    } catch (error) {
      throw new HttpException(
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
        error.message || "获取今日笔记失败",
        HttpStatus.BAD_REQUEST
      );
    }
  }

  /**
   * 获取用户笔记统计信息的接口
   * 完整路由: GET /note/stats/user/:userId
   * 注意：这个路由也必须放在 :id/user/:userId 之前，避免路由冲突
   */
  @Get("stats/user/:userId")
  async getStats(@Param("userId") userId: string) {
    try {
      const userIdNum = +userId;

      if (isNaN(userIdNum)) {
        throw new Error("用户ID格式无效");
      }

      return await this.noteService.getStats(userIdNum);
    } catch (error) {
      throw new HttpException(
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
        error.message || "获取笔记统计失败",
        HttpStatus.BAD_REQUEST
      );
    }
  }

  /**
   * 根据ID获取单个笔记的接口
   * @Get(':id/user/:userId') 路由包含笔记ID和用户ID
   * 完整路由: GET /note/:id/user/:userId
   * 注意：这个通用路由必须放在具体路由之后
   */
  @Get(":id/user/:userId")
  async findOne(@Param("id") id: string, @Param("userId") userId: string) {
    try {
      const noteId = +id;
      const userIdNum = +userId;

      if (isNaN(noteId) || isNaN(userIdNum)) {
        throw new Error("笔记ID或用户ID格式无效");
      }

      return await this.noteService.findOne(noteId, userIdNum);
    } catch (error) {
      throw new HttpException(
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
        error.message || "获取笔记详情失败",
        HttpStatus.BAD_REQUEST
      );
    }
  }

  /**
   * 更新笔记的接口
   * @Put(':id/user/:userId') 装饰器表示这是一个PUT请求
   * 完整路由: PUT /note/:id/user/:userId
   */
  @Put(":id/user/:userId")
  async update(
    @Param("id") id: string,
    @Param("userId") userId: string,
    @Body() updateNoteDto: UpdateNoteDto
  ) {
    try {
      const noteId = +id;
      const userIdNum = +userId;

      if (isNaN(noteId) || isNaN(userIdNum)) {
        throw new Error("笔记ID或用户ID格式无效");
      }

      return await this.noteService.update(noteId, userIdNum, updateNoteDto);
    } catch (error) {
      throw new HttpException(
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
        error.message || "更新笔记失败",
        HttpStatus.BAD_REQUEST
      );
    }
  }

  /**
   * 删除笔记的接口
   * @Delete(':id/user/:userId') 装饰器表示这是一个DELETE请求
   * 完整路由: DELETE /note/:id/user/:userId
   */
  @Delete(":id/user/:userId")
  async remove(@Param("id") id: string, @Param("userId") userId: string) {
    try {
      const noteId = +id;
      const userIdNum = +userId;

      if (isNaN(noteId) || isNaN(userIdNum)) {
        throw new Error("笔记ID或用户ID格式无效");
      }

      return await this.noteService.remove(noteId, userIdNum);
    } catch (error) {
      throw new HttpException(
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
        error.message || "删除笔记失败",
        HttpStatus.BAD_REQUEST
      );
    }
  }

  /**
   * 实时保存今天的笔记的接口（每天一条记录）
   * 完整路由: POST /note/save-today
   */
  @Post("save-today")
  async saveOrUpdateTodayNote(
    @Body()
    saveNoteDto: {
      userId: number;
      note: string;
    }
  ) {
    try {
      const { userId, note } = saveNoteDto;

      // 添加输入验证和调试日志
      console.log(
        `接收到保存今日笔记请求：用户ID=${userId}, 笔记长度=${note?.length || 0}`
      );

      if (!userId || isNaN(userId)) {
        throw new Error("用户ID格式无效");
      }

      if (typeof note !== "string") {
        throw new Error("笔记内容格式无效");
      }

      return await this.noteService.saveOrUpdateTodayNote(userId, note);
    } catch (error) {
      console.error(`保存今日笔记失败：`, error);
      throw new HttpException(
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
        error.message || "保存今日笔记失败",
        HttpStatus.BAD_REQUEST
      );
    }
  }

  /**
   * 实时保存笔记的接口（创建或更新）
   * 完整路由: POST /note/save
   * @deprecated 建议使用 POST /note/save-today 实现每天一条笔记的逻辑
   */
  @Post("save")
  async saveOrUpdate(
    @Body()
    saveNoteDto: {
      userId: number;
      note: string;
      noteId?: number;
    }
  ) {
    try {
      const { userId, note, noteId } = saveNoteDto;
      return await this.noteService.saveOrUpdate(userId, note, noteId);
    } catch (error) {
      throw new HttpException(
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
        error.message || "保存笔记失败",
        HttpStatus.BAD_REQUEST
      );
    }
  }
}
