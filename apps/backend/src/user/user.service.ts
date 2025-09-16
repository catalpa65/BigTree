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
    private userRepository: Repository<UserEntity>
  ) {}

  // 发送验证码
  async sendVerificationCode(sendVerificationCodeDto: SendVerificationCodeDto) {
    const { phone } = sendVerificationCodeDto;

    // 生成6位随机验证码
    const verificationCode = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    // 查找或创建用户
    let user = await this.userRepository.findOne({ where: { phone } });

    if (!user) {
      // 创建新用户
      user = this.userRepository.create({
        phone,
        verify_code: verificationCode,
      });

      // 保存用户并获取生成的ID
      user = await this.userRepository.save(user);

      // 确保用户ID正确生成
      if (!user.id) {
        console.error(`用户创建失败，ID未生成 - 手机号: ${phone}`);
        throw new Error("用户创建失败，请稍后重试");
      }

      console.log(`新用户创建成功 - ID: ${user.id}, 手机号: ${phone}`);
    } else {
      // 更新验证码
      user.verify_code = verificationCode;
      await this.userRepository.save(user);
      console.log(`更新用户验证码 - ID: ${user.id}, 手机号: ${phone}`);
    }

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

    console.log(`登录尝试 - 手机号: ${phone}`);

    const user = await this.userRepository.findOne({ where: { phone } });

    if (!user) {
      console.error(`登录失败 - 用户不存在: ${phone}`);
      throw new Error("用户不存在");
    }

    console.log(`找到用户 - ID: ${user.id}, 手机号: ${phone}`);

    if (user.verify_code !== verificationCode) {
      console.error(
        `登录失败 - 验证码错误: ${phone}, 期望: ${user.verify_code}, 收到: ${verificationCode}`
      );
      throw new Error("验证码错误");
    }

    // 确保用户ID存在
    if (!user.id) {
      console.error(`登录失败 - 用户ID为空: ${phone}, 用户对象:`, user);
      throw new Error("用户数据异常，请重新注册");
    }

    // 验证ID是否为有效数字
    if (isNaN(user.id) || user.id <= 0) {
      console.error(`登录失败 - 用户ID无效: ${phone}, ID: ${user.id}`);
      throw new Error("用户数据异常，请重新注册");
    }

    const userData = {
      id: user.id.toString(), // 转换为字符串类型
      phoneNumber: user.phone, // 修复字段名：phone -> phoneNumber
    };

    console.log(`登录成功 - ID: ${user.id}, 手机号: ${phone}`, userData);

    // TODO: 这里应该生成JWT token
    return {
      message: "登录成功",
      token: `temp_token_${user.id}_${Date.now()}`, // 临时token，后续需要实现JWT
      user: userData,
    };
  }
}
