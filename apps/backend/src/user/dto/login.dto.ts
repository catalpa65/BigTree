import { IsNotEmpty, IsString, Matches } from "class-validator";

export class LoginDto {
  @IsString({ message: "手机号必须为字符串" })
  @IsNotEmpty({ message: "手机号不能为空" })
  @Matches(/^1[3-9]\d{9}$/, { message: "手机号格式不正确" })
  phone: string;

  @IsString({ message: "验证码必须为字符串" })
  @IsNotEmpty({ message: "验证码不能为空" })
  @Matches(/^\d{6}$/, { message: "验证码格式不正确" })
  verificationCode: string;
}
