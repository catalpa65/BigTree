// 引入class-validator装饰器，用于数据验证
import { IsNotEmpty, IsNumber } from "class-validator";

/**
 * 创建打卡记录的数据传输对象（DTO）
 * DTO的作用：
 * 1. 定义API接口接收的数据格式
 * 2. 自动验证传入的数据是否符合要求
 * 3. 提供类型安全和代码提示
 */
export class CreatePunchRecordDto {
  /**
   * 用户ID字段
   * @IsNotEmpty: 验证字段不能为空（null、undefined、空字符串都不行）
   * @IsNumber: 验证字段必须是数字类型
   * message: 验证失败时返回的错误信息
   */
  @IsNotEmpty({ message: "用户ID不能为空" })
  @IsNumber({}, { message: "用户ID必须是数字" })
  userId: number; // TypeScript类型定义：number类型
}
