// 引入NestJS核心装饰器和HTTP相关功能
import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post, // POST请求装饰器
} from "@nestjs/common";
// 引入数据传输对象（DTO），用于验证和传输数据
import { CreatePunchRecordDto } from "./dto/create-punch-record.dto";
// 引入打卡记录服务，包含业务逻辑
import { PunchRecordService } from "./punch-record.service";

/**
 * 打卡记录控制器
 * @Controller('punch-record') 装饰器定义了这个控制器的路由前缀
 * 所有的路由都会以 /punch-record 开头
 */
@Controller("punch-record")
export class PunchRecordController {
  /**
   * 构造函数：依赖注入
   * private readonly: TypeScript修饰符，表示这是一个私有只读属性
   * NestJS会自动注入PunchRecordService的实例
   */
  constructor(private readonly punchRecordService: PunchRecordService) {}

  /**
   * 创建打卡记录的接口
   * @Post() 装饰器表示这是一个POST请求
   * 完整路由: POST /punch-record
   * @Body() 装饰器用于获取请求体中的数据，并自动验证DTO
   */
  @Post()
  async create(@Body() createPunchRecordDto: CreatePunchRecordDto) {
    try {
      // 调用服务层的方法处理业务逻辑
      return await this.punchRecordService.create(createPunchRecordDto);
    } catch (error) {
      /**
       * 错误处理：将服务层的错误转换为HTTP异常
       * HttpException: NestJS提供的HTTP异常类
       * HttpStatus.BAD_REQUEST: 400状态码，表示客户端请求错误
       */
      throw new HttpException(
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
        error.message || "打卡失败", // 错误信息，如果没有具体信息则使用默认信息
        HttpStatus.BAD_REQUEST, // HTTP状态码400
      );
    }
  }

  /**
   * 根据用户ID获取打卡记录的接口
   * @Get('user/:userId') 装饰器表示这是一个GET请求
   * 完整路由: GET /punch-record/user/:userId
   * :userId 是路由参数，可以匹配任何值，比如 /punch-record/user/123
   * @Param('userId') 装饰器用于获取URL中的userId参数
   */
  @Get("user/:userId")
  async findByUserId(@Param("userId") userId: string) {
    try {
      /**
       * 调用服务层方法获取用户打卡记录
       * +userId: 将字符串转换为数字（一元加号操作符）
       * 因为URL参数总是字符串，但我们的服务需要数字类型
       */
      return await this.punchRecordService.findByUserId(+userId);
    } catch (error) {
      // 错误处理，同上
      throw new HttpException(
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
        error.message || "获取打卡记录失败",
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
