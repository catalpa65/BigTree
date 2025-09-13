import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
} from "@nestjs/common";
import { LoginDto } from "./dto/login.dto";
import { SendVerificationCodeDto } from "./dto/send-verification-code.dto";
import { UserService } from "./user.service";

@Controller("user")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post("send-verification-code")
  async sendVerificationCode(
    @Body() sendVerificationCodeDto: SendVerificationCodeDto,
  ) {
    return this.userService.sendVerificationCode(sendVerificationCodeDto);
  }

  @Post("login")
  async login(@Body() loginDto: LoginDto) {
    try {
      return await this.userService.login(loginDto);
    } catch (error) {
      throw new HttpException(
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
        error.message || "登录失败",
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
