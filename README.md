# 爱乐查 - 生活小助手（微信小程序）

## 项目简介

爱乐查是一款基于微信小程序平台开发的生活服务类应用，提供汇率换算、快递查询、身份证/银行卡/手机号归属地查询等实用功能。项目采用微信小程序原生开发模式，致力于为用户提供便捷的生活信息查询服务。

## 技术栈

| 类别 | 技术 | 说明 |
|------|------|------|
| 前端框架 | 微信小程序原生框架 | WXML + WXSS + JavaScript |
| 开发工具 | 微信开发者工具 | 官方 IDE |
| 数据存储 | 本地 Storage | `wx.setStorageSync` |
| 网络请求 | 微信小程序原生 API | `wx.request` |
| 后端服务 | zhaotool.com API | 第三方数据接口 |

## 项目结构

```
├── app.js                  # 应用入口，全局数据配置
├── app.json                # 全局页面路由与窗口配置
├── app.wxss                # 全局样式
├── project.config.json     # 项目配置文件
├── pages/                  # 页面目录
│   ├── nindex/             # 首页（新版）
│   │   ├── index.js
│   │   ├── index.wxml
│   │   ├── index.wxss
│   │   └── index.json
│   ├── index/              # 旧版首页
│   ├── exchangeCal/        # 汇率计算器
│   ├── exchangeList/       # 汇率列表
│   ├── currencyList/       # 币种选择
│   ├── idcard/             # 身份证/银行卡/手机号查询
│   ├── exp/index/          # 快递查询
│   └── about/              # 关于页面
├── untils/                 # 工具函数（注意：目录名拼写为 untils）
│   ├── util.js             # 通用工具（formatTime、fetchURL）
│   ├── untils.js           # 扩展工具（含影视类冗余函数）
│   ├── exputil.js          # 快递查询专用工具
│   └── list.js             # 货币数据静态配置
├── images/                 # 图片资源
│   ├── tab/                # Tab 栏图标
│   └── icon/               # 服务图标
└── dist/                   # 第三方样式库（ionic、extend）
```

## 核心功能

1. **汇率换算** - 支持多币种实时汇率查询与换算，含历史日期选择
2. **快递查询** - 支持国内外快递单号查询，含扫码识别与历史记录
3. **归属地查询** - 支持身份证、银行卡、手机号归属地查询
4. **首页服务** - 轮播图、文字广告、服务入口网格

## 快速开始

### 环境要求

- 微信开发者工具 >= 1.06.2401020
- 微信小程序基础库 >= 1.6.6
- Node.js >= 16.x（用于后续工程化改造）

### 运行项目

1. 克隆项目到本地
   ```bash
   git clone https://github.com/dave_hai/XiaoChengXuAiLeCha.git
   ```

2. 使用微信开发者工具打开项目目录

3. 在模拟器中编译（Ctrl+S 或点击编译按钮）查看效果

### 构建生产版本

```bash
# 当前为原生小程序项目，直接在微信开发者工具中点击"上传"
# 后续工程化改造后将支持命令行构建
```

## 核心模块说明

### 汇率计算模块

- **入口页面**：`pages/exchangeCal/exchangeCal`
- **核心逻辑**：
  - 从 `app.js` 读取默认币种（美元 ↔ 人民币）
  - 调用 `/v1/wx/huobi/{debit}/{trade}/{date}` 接口获取实时汇率
  - 使用 `parseFloat(rate * amount).toFixed(2)` 计算结果
- **数据配置**：`untils/list.js` 中定义了完整的货币列表（charge/trade）

### 查询模块

- **入口页面**：`pages/idcard/idcard`
- **核心逻辑**：
  - 统一调用 `/v1/wx/info` 接口，通过返回的 `sid` 区分查询类型
  - `S100`：银行卡归属地
  - `S101`：手机号归属地
  - `S102`：身份证归属地

### 快递查询模块

- **入口页面**：`pages/exp/index/index`
- **核心逻辑**：
  - 调用 `/v1/exp/info/{number}` 接口查询物流信息
  - 支持手动输入、扫码识别两种方式
  - 历史记录存储于本地 Storage，以 `TN::` 前缀标识

## 已知问题与改进方向

### 当前技术债务

| 问题 | 影响 | 优先级 |
|------|------|--------|
| 纯 JavaScript，无 TypeScript 支持 | 类型不安全，维护困难 | 高 |
| 无统一网络层封装 | 请求逻辑分散，错误处理重复 | 高 |
| 全局状态管理混乱 | `globalData` 与 App 实例属性混用 | 中 |
| 工具函数重复定义 | `util.js` 与 `untils.js` 重复 | 中 |
| 无测试覆盖 | 无法保障代码质量 | 高 |
| 目录命名不规范 | `untils` 应为 `utils` | 低 |

### 工程化建议

详见 [reme.md](./reme.md)，包含以下内容：
- 8 个可扩展功能模块（汇率预警、走势图表、语音输入等）
- 6 个可迭代功能模块（计算引擎重构、历史记录、用户体系等）
- TypeScript 迁移方案
- 网络层重构方案
- 单元测试与 E2E 测试方案
- 构建工具链与工程规范
- 性能监控与灰度发布

## API 接口说明

### 汇率接口

```
GET https://www.zhaotool.com/v1/wx/huobi/{debitCurrency}/{tradeCurrency}/{date}

示例：
https://www.zhaotool.com/v1/wx/huobi/CNY/USD/2024-01-01
```

### 归属地查询接口

```
POST https://www.zhaotool.com/v1/wx/info
Content-Type: application/json

Body: {"q": "查询内容"}

响应：
{
  "code": "0",
  "data": { ... },
  "sid": "S100"  // S100=银行卡, S101=手机号, S102=身份证
}
```

### 快递查询接口

```
POST https://www.zhaotool.com/v1/exp/info/{快递单号}
```

## 贡献指南

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开 Pull Request

## 许可证

MIT License

---

> 本项目为早期微信小程序学习项目，代码风格和架构有待优化。欢迎提交 Issue 和 PR 共同改进。
