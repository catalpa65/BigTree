// 引入NestJS测试相关的模块
import { Test, TestingModule } from "@nestjs/testing";
// 引入我们要测试的控制器
import { PunchRecordController } from "./punch-record.controller";
// 引入控制器依赖的服务（用于创建Mock）
import { PunchRecordService } from "./punch-record.service";

/**
 * 打卡记录控制器测试套件
 * describe: 定义一个测试套件，用来组织相关的测试用例
 */
describe("PunchRecordController", () => {
  // 声明控制器变量，用于在测试中调用控制器的方法
  let controller: PunchRecordController;

  /**
   * 创建Mock服务对象
   * Mock: 模拟对象，用来替代真实的服务，这样测试时不会调用真实的数据库
   * jest.fn(): Jest提供的函数，用来创建一个可以被监控的假函数
   */
  const mockService = {
    create: jest.fn(), // 模拟创建打卡记录的方法
    findByUserId: jest.fn(), // 模拟根据用户ID查找记录的方法
  };

  /**
   * beforeEach: 在每个测试用例运行前都会执行这个函数
   * 作用：为每个测试准备一个干净的环境
   */
  beforeEach(async () => {
    /**
     * 创建测试模块
     * Test.createTestingModule(): NestJS提供的方法，用来创建一个测试用的模块
     */
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PunchRecordController], // 注册要测试的控制器
      providers: [
        {
          provide: PunchRecordService, // 提供服务的名称
          useValue: mockService, // 使用我们的Mock对象替代真实服务
        },
      ],
    }).compile(); // 编译模块

    // 从测试模块中获取控制器实例
    controller = module.get<PunchRecordController>(PunchRecordController);

    /**
     * 清除所有Mock函数的调用记录
     * 确保每个测试用例都是独立的，不会互相影响
     */
    jest.clearAllMocks();
  });

  /**
   * 第一个测试用例：验证控制器是否被正确创建
   * it(): 定义一个测试用例
   */
  it("应该被定义", () => {
    // expect(): Jest提供的断言函数，用来验证结果是否符合预期
    // toBeDefined(): 检查变量是否被定义（不是undefined）
    expect(controller).toBeDefined();
  });

  /**
   * 第二个测试用例：测试创建打卡记录功能
   */
  it("应该创建打卡记录", async () => {
    // 准备测试数据：期望的返回结果
    const result = { message: "打卡成功", data: { id: 1 } };

    /**
     * 设置Mock函数的返回值
     * mockResolvedValue(): 让Mock函数返回一个成功的Promise
     * 这样当控制器调用service.create()时，会得到我们设定的结果
     */
    mockService.create.mockResolvedValue(result);

    /**
     * 执行测试
     * 1. 调用控制器的create方法，传入测试数据 { userId: 1 }
     * 2. 验证返回结果是否等于我们期望的result
     * toBe(): 检查两个值是否完全相等
     */
    expect(await controller.create({ userId: 1 })).toBe(result);
  });

  /**
   * 第三个测试用例：测试获取用户打卡记录功能
   */
  it("应该获取用户打卡记录", async () => {
    // 准备测试数据：期望的返回结果（空数组表示用户还没有打卡记录）
    const result = { message: "获取成功", data: [] };

    // 设置Mock函数的返回值
    mockService.findByUserId.mockResolvedValue(result);

    /**
     * 执行测试
     * 调用控制器的findByUserId方法，传入字符串'1'（模拟URL参数）
     * 验证返回结果是否等于期望值
     */
    expect(await controller.findByUserId("1")).toBe(result);
  });
});
