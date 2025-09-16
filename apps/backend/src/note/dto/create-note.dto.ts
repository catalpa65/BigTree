// 引入class-validator装饰器，用于数据验证
import { IsNotEmpty, IsNumber, IsString, MaxLength } from "class-validator";

/**
 * 创建笔记的数据传输对象（DTO）
 * DTO的作用：
 * 1. 定义API接口接收的数据格式
 * 2. 自动验证传入的数据是否符合要求
 * 3. 提供类型安全和代码提示
 */
export class CreateNoteDto {
  /**
   * 用户ID字段
   * @IsNotEmpty: 验证字段不能为空
   * @IsNumber: 验证字段必须是数字类型
   */
  @IsNotEmpty({ message: "用户ID不能为空" })
  @IsNumber({}, { message: "用户ID必须是数字" })
  userId: number;

  /**
   * 笔记内容字段
   * @IsNotEmpty: 验证字段不能为空
   * @IsString: 验证字段必须是字符串类型
   * @MaxLength: 限制最大长度为5000字符
   */
  @IsNotEmpty({ message: "笔记内容不能为空" })
  @IsString({ message: "笔记内容必须是字符串" })
  @MaxLength(5000, { message: "笔记内容不能超过5000字符" })
  note: string;
}
