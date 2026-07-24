# 工程化说明（ENGINEERING）

本项目在保留原微信原生小程序运行结构的前提下，引入 TypeScript 与配套工程化能力。本文档描述目录规范、构建流程与各能力模块。

## 目录结构规范

```
.
├── src/                    # TypeScript 源码（工程化核心，编译产物输出到根目录/各目录）
│   ├── app.ts              # 小程序入口，注入监控初始化
│   ├── api/                # 网络层
│   │   ├── request.ts      # 统一请求封装（Promise 化、拦截器、超时、错误处理）
│   │   ├── services.ts     # 按业务领域组织的接口方法
│   │   └── index.ts
│   ├── config/             # 环境配置（baseURL / CDN / 上报地址）
│   ├── types/              # 核心类型定义
│   │   ├── common.ts       # 通用：ApiResponse / RequestOptions
│   │   ├── currency.ts     # 货币与汇率
│   │   ├── lookup.ts       # 归属地查询（银行卡/手机/身份证）
│   │   ├── express.ts      # 国际快递
│   │   └── index.ts
│   ├── utils/              # 工具函数（format / track / cdn）
│   └── monitor/            # 监控体系
│       ├── reporter.ts     # 批量上报器
│       ├── performance.ts  # 性能监控
│       ├── error.ts        # 错误监控
│       └── index.ts
├── pages/                  # 主包页面（首页、关于、查询、身份证）
├── subpackages/            # 分包
│   ├── exchange/           # 汇率分包（exchangeCal / currencyList / exchangeList）
│   └── express/            # 快递查询分包
├── untils/                 # 历史工具（逐步迁移到 src/utils）
├── images/                 # 本地图片（压缩后迁移 CDN）
├── scripts/                # 工程脚本（图片压缩 / CDN 上传 / CI 上传）
├── .github/workflows/      # CI/CD 流水线
├── tsconfig.json           # TS 配置（含路径别名 @api / @utils / @types 等）
├── .eslintrc.js            # ESLint（TS + Prettier 集成）
├── .prettierrc.json        # Prettier
├── .husky/                 # Git 钩子（pre-commit: lint-staged；pre-push: type-check）
└── typedoc.json            # 文档生成配置
```

### 命名与分层约定
- **类型**：统一放 `src/types`，按业务域拆分文件，经 `index.ts` 汇总导出。
- **网络请求**：页面禁止直接 `wx.request`，统一走 `src/api`。新增接口在 `services.ts` 声明并标注返回泛型。
- **常量/环境**：集中在 `src/config`，区分 development / production。
- **监控**：仅通过 `src/monitor` 暴露的 `initMonitor` / `report` / `reportError` 接入。

## 常用命令

| 命令 | 说明 |
| --- | --- |
| `npm install` | 安装依赖并激活 husky 钩子 |
| `npm run build` | 编译 TS → JS |
| `npm run type-check` | 仅类型检查 |
| `npm run lint` / `lint:fix` | ESLint 检查 / 自动修复 |
| `npm run format` | Prettier 格式化 |
| `npm run compress:images` | 压缩 images/ 图片 |
| `npm run upload:cdn` | 上传图片到 CDN 并生成映射清单 |
| `npm run docs` | TypeDoc 生成 API 文档 |
| `npm run ci:upload` | miniprogram-ci 上传体验版 |

## 网络层用法示例

```ts
import { lookupInfo, fetchRate } from '@api';

const res = await lookupInfo(q);       // ApiResponse<LookupData>
const rate = await fetchRate('CNY', 'USD', '2026-07-24'); // RateData
```

## 分包与预下载
- 主包仅保留高频入口页面，`subpackages/exchange`、`subpackages/express` 按需加载。
- `app.json` 的 `preloadRule` 在首页 WiFi 环境下预下载两个分包，兼顾首屏体积与后续流畅度。

## 监控体系
- **性能**：启动耗时、原生 Performance 指标、接口耗时（复用请求响应拦截器）。
- **错误**：`wx.onError` / `wx.onUnhandledRejection` / App onError 兜底，批量节流上报，进入后台时 flush。
- 上报地址见 `src/config` 的 `reportURL`。

## CI/CD
`.github/workflows/ci.yml`：
1. `quality`：类型检查 + ESLint + Prettier。
2. `build`：编译 + 生成文档产物。
3. `docs-deploy`：主分支部署文档到 GitHub Pages。
4. `release`：打 `v*` tag 时用 miniprogram-ci 上传体验版（密钥走 GitHub Secrets：`MP_APPID`、`MP_PRIVATE_KEY`）。

## 迁移说明
原 `untils/`、`pages/*.js` 为历史 ES5 代码，工程化能力已在 `src/` 就绪。后续可逐页把业务逻辑迁移到 TS（引用 `@api`、`@utils`、`@types`），编译产物覆盖对应 `.js` 即可，无需一次性重写。
