# 共享包目录

这个目录用于存放项目间共享的代码包，例如：

- 共享的 TypeScript 类型定义
- 通用工具函数
- 共享的 UI 组件库
- 业务逻辑共享包

## 示例结构

```
packages/
├── shared-types/       # 共享类型定义
├── ui-components/      # 共享UI组件
├── utils/             # 工具函数
└── constants/         # 常量定义
```

每个包都应该有自己的 `package.json` 文件并遵循 `@english-tree/` 命名规范。
