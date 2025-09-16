import { PartialType } from "@nestjs/mapped-types";
import { CreateNoteDto } from "./create-note.dto";

/**
 * 更新笔记的数据传输对象（DTO）
 * 继承自CreateNoteDto，但所有字段都是可选的
 * PartialType 会自动将所有字段设为可选
 */
export class UpdateNoteDto extends PartialType(CreateNoteDto) {
  // 可以在这里添加更新笔记特有的字段
  // 例如：版本号、更新原因等
}
