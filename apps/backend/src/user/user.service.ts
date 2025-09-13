import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { LoginDto } from "./dto/login.dto";
import { SendVerificationCodeDto } from "./dto/send-verification-code.dto";
import { UserEntity } from "./entities/user.entity";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  // 发送验证码
  async sendVerificationCode(sendVerificationCodeDto: SendVerificationCodeDto) {
    const { phone } = sendVerificationCodeDto;

    // 生成6位随机验证码
    const verificationCode = Math.floor(
      100000 + Math.random() * 900000,
    ).toString();

    // 查找或创建用户
    let user = await this.userRepository.findOne({ where: { phone } });

    if (!user) {
      // 创建新用户，只在内存中创建
      user = this.userRepository.create({
        phone,
        verify_code: verificationCode,
      });
    } else {
      // 更新验证码
      user.verify_code = verificationCode;
    }

    // 保存用户
    await this.userRepository.save(user);

    // TODO: 这里应该调用短信服务发送验证码
    console.log(`发送验证码 ${verificationCode} 到手机号 ${phone}`);

    return {
      message: "验证码发送成功",
      // 注意：生产环境不应该返回验证码
      code: verificationCode, // 开发阶段临时返回，便于测试
    };
  }

  // 登录
  async login(loginDto: LoginDto) {
    const { phone, verificationCode } = loginDto;

    const user = await this.userRepository.findOne({ where: { phone } });

    if (!user) {
      throw new Error("用户不存在");
    }

    if (user.verify_code !== verificationCode) {
      throw new Error("验证码错误");
    }

    // TODO: 这里应该生成JWT token
    return {
      message: "登录成功",
      user: {
        id: user.id,
        phone: user.phone,
      },
    };
  }
}
