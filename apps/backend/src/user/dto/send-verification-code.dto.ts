import { IsNotEmpty, IsString, Matches } from "class-validator";

export class SendVerificationCodeDto {
  @IsString({ message: "手机号必须为字符串" })
  @IsNotEmpty({ message: "手机号不能为空" })
  @Matches(/^1[3-9]\d{9}$/, { message: "手机号格式不正确" })
  phone: string;
}
