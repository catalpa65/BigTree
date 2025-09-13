#!/bin/bash

echo "🚀 开始测试 API..."
echo ""

BASE_URL="http://localhost:3000"
PHONE="13800138000"
USER_ID=1

# 颜色定义
GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}📱 1. 测试发送验证码...${NC}"
SEND_CODE_RESPONSE=$(curl -s -X POST "${BASE_URL}/user/send-verification-code" \
  -H "Content-Type: application/json" \
  -d "{\"phone\":\"${PHONE}\"}")

if [[ $? -eq 0 ]]; then
  echo -e "${GREEN}✅ 发送验证码成功${NC}"
  echo "$SEND_CODE_RESPONSE" | jq '.'
  
  # 提取验证码（如果有jq工具）
  if command -v jq &> /dev/null; then
    VERIFICATION_CODE=$(echo "$SEND_CODE_RESPONSE" | jq -r '.code')
    echo -e "${BLUE}📋 验证码: ${VERIFICATION_CODE}${NC}"
  else
    echo "⚠️  请手动从上面的响应中获取验证码"
    read -p "请输入验证码: " VERIFICATION_CODE
  fi
else
  echo -e "${RED}❌ 发送验证码失败${NC}"
  exit 1
fi

echo ""
echo -e "${BLUE}🔐 2. 测试登录...${NC}"
LOGIN_RESPONSE=$(curl -s -X POST "${BASE_URL}/user/login" \
  -H "Content-Type: application/json" \
  -d "{\"phone\":\"${PHONE}\",\"verificationCode\":\"${VERIFICATION_CODE}\"}")

if [[ $? -eq 0 ]]; then
  echo -e "${GREEN}✅ 登录成功${NC}"
  echo "$LOGIN_RESPONSE" | jq '.' 2>/dev/null || echo "$LOGIN_RESPONSE"
else
  echo -e "${RED}❌ 登录失败${NC}"
fi

echo ""
echo -e "${BLUE}⏰ 3. 测试打卡...${NC}"
PUNCH_RESPONSE=$(curl -s -X POST "${BASE_URL}/punch-record" \
  -H "Content-Type: application/json" \
  -d "{\"userId\":${USER_ID}}")

if [[ $? -eq 0 ]]; then
  echo -e "${GREEN}✅ 打卡成功${NC}"
  echo "$PUNCH_RESPONSE" | jq '.' 2>/dev/null || echo "$PUNCH_RESPONSE"
else
  echo -e "${RED}❌ 打卡失败${NC}"
fi

echo ""
echo -e "${BLUE}🚫 4. 测试重复打卡（应该失败）...${NC}"
REPEAT_PUNCH_RESPONSE=$(curl -s -X POST "${BASE_URL}/punch-record" \
  -H "Content-Type: application/json" \
  -d "{\"userId\":${USER_ID}}")

# 检查是否包含错误信息
if echo "$REPEAT_PUNCH_RESPONSE" | grep -q "已经打过卡"; then
  echo -e "${GREEN}✅ 重复打卡正确被拦截${NC}"
  echo "$REPEAT_PUNCH_RESPONSE" | jq '.' 2>/dev/null || echo "$REPEAT_PUNCH_RESPONSE"
else
  echo -e "${RED}❌ 重复打卡应该失败，但成功了${NC}"
  echo "$REPEAT_PUNCH_RESPONSE"
fi

echo ""
echo -e "${BLUE}📊 5. 测试获取打卡记录...${NC}"
RECORDS_RESPONSE=$(curl -s -X GET "${BASE_URL}/punch-record/user/${USER_ID}")

if [[ $? -eq 0 ]]; then
  echo -e "${GREEN}✅ 获取打卡记录成功${NC}"
  echo "$RECORDS_RESPONSE" | jq '.' 2>/dev/null || echo "$RECORDS_RESPONSE"
else
  echo -e "${RED}❌ 获取打卡记录失败${NC}"
fi

echo ""
echo -e "${BLUE}❌ 6. 测试验证失败的情况...${NC}"

# 测试无效手机号
echo "测试无效手机号..."
INVALID_PHONE_RESPONSE=$(curl -s -X POST "${BASE_URL}/user/send-verification-code" \
  -H "Content-Type: application/json" \
  -d "{\"phone\":\"123456\"}")

if echo "$INVALID_PHONE_RESPONSE" | grep -q "手机号格式"; then
  echo -e "${GREEN}✅ 无效手机号正确被拦截${NC}"
else
  echo -e "${RED}❌ 无效手机号应该被拦截${NC}"
fi

echo ""
echo -e "${GREEN}🎉 所有测试完成！${NC}"
