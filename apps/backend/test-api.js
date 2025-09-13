const axios = require('axios');

const BASE_URL = 'http://localhost:3000';

// 测试数据
const testPhone = '13800138000';
const testUserId = 1;

async function testAPI() {
  console.log('🚀 开始测试 API...\n');

  try {
    // 1. 测试发送验证码
    console.log('📱 测试发送验证码...');
    const sendCodeResult = await axios.post(`${BASE_URL}/user/send-verification-code`, {
      phone: testPhone
    });
    console.log('✅ 发送验证码成功:', sendCodeResult.data);
    
    const verificationCode = sendCodeResult.data.code;
    console.log(`📋 验证码: ${verificationCode}\n`);

    // 2. 测试登录
    console.log('🔐 测试登录...');
    const loginResult = await axios.post(`${BASE_URL}/user/login`, {
      phone: testPhone,
      verificationCode: verificationCode
    });
    console.log('✅ 登录成功:', loginResult.data);
    console.log('');

    // 3. 测试打卡
    console.log('⏰ 测试打卡...');
    const punchResult = await axios.post(`${BASE_URL}/punch-record`, {
      userId: testUserId
    });
    console.log('✅ 打卡成功:', punchResult.data);
    console.log('');

    // 4. 测试重复打卡（应该失败）
    console.log('🚫 测试重复打卡（应该失败）...');
    try {
      await axios.post(`${BASE_URL}/punch-record`, {
        userId: testUserId
      });
      console.log('❌ 重复打卡应该失败，但成功了');
    } catch (error) {
      console.log('✅ 重复打卡正确被拦截:', error.response.data.message);
    }
    console.log('');

    // 5. 测试获取打卡记录
    console.log('📊 测试获取打卡记录...');
    const recordsResult = await axios.get(`${BASE_URL}/punch-record/user/${testUserId}`);
    console.log('✅ 获取打卡记录成功:', recordsResult.data);
    console.log('');

    // 6. 测试验证失败的情况
    console.log('❌ 测试验证失败的情况...');
    
    // 测试无效手机号
    try {
      await axios.post(`${BASE_URL}/user/send-verification-code`, {
        phone: '123456'
      });
      console.log('❌ 无效手机号应该失败，但成功了');
    } catch (error) {
      console.log('✅ 无效手机号正确被拦截:', error.response.data.message);
    }

    // 测试错误验证码
    try {
      await axios.post(`${BASE_URL}/user/login`, {
        phone: testPhone,
        verificationCode: '000000'
      });
      console.log('❌ 错误验证码应该失败，但成功了');
    } catch (error) {
      console.log('✅ 错误验证码正确被拦截:', error.response.data.message);
    }

    // 测试缺少字段
    try {
      await axios.post(`${BASE_URL}/punch-record`, {
        // 缺少 userId
      });
      console.log('❌ 缺少userId应该失败，但成功了');
    } catch (error) {
      console.log('✅ 缺少字段正确被拦截:', error.response.data.message);
    }

    console.log('\n🎉 所有测试完成！');

  } catch (error) {
    console.error('❌ 测试过程中出现错误:');
    if (error.response) {
      console.error('状态码:', error.response.status);
      console.error('错误信息:', error.response.data);
    } else if (error.request) {
      console.error('网络错误:', error.message);
      console.error('请确保服务器在 http://localhost:3000 运行');
    } else {
      console.error('未知错误:', error.message);
    }
  }
}

// 运行测试
testAPI();
