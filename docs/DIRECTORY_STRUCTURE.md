# VS Code 扩展常用目录结构

本文档说明 VS Code 扩展开发中的常用目录结构及其用途。

## 标准目录结构

```
your-extension/
├── .vscode/                    # VS Code 工作区配置
│   ├── launch.json            # 调试配置
│   ├── tasks.json             # 任务配置
│   └── extensions.json        # 推荐扩展
│
├── src/                        # 源代码目录（主要开发目录）
│   ├── extension.ts           # 扩展入口文件（必需）
│   ├── commands/              # 命令实现
│   │   ├── generateAPI.ts
│   │   └── helloWorld.ts
│   ├── utils/                 # 工具函数
│   │   ├── common.ts
│   │   ├── stateManager.ts
│   │   └── yapi.ts
│   ├── services/              # 服务层
│   │   ├── apiService.ts
│   │   └── configService.ts
│   ├── providers/             # 提供者（如代码补全、悬停提示等）
│   │   ├── completionProvider.ts
│   │   └── hoverProvider.ts
│   ├── views/                 # 视图相关（Webview、TreeView等）
│   │   ├── webviewPanel.ts
│   │   └── treeDataProvider.ts
│   ├── types/                 # TypeScript 类型定义
│   │   └── index.ts
│   └── test/                  # 测试文件
│       ├── extension.test.ts
│       └── suite/
│
├── resources/                  # 静态资源
│   ├── icons/                 # 图标文件
│   │   ├── icon.png
│   │   └── icon.svg
│   ├── images/                # 图片资源
│   └── templates/             # 模板文件
│
├── media/                      # 媒体文件（用于 README 等）
│   └── screenshots/
│
├── dist/                       # 编译输出目录（通常添加到 .gitignore）
│   ├── extension.js
│   └── extension.js.map
│
├── out/                        # TypeScript 编译输出（如果使用 tsc）
│
├── node_modules/               # 依赖包（添加到 .gitignore）
│
├── .vscodeignore              # 发布时忽略的文件列表
├── .gitignore                 # Git 忽略文件
├── .eslintignore              # ESLint 忽略文件
│
├── package.json               # 扩展清单文件（必需）
├── tsconfig.json              # TypeScript 配置
├── eslint.config.mjs          # ESLint 配置
├── esbuild.js                 # 构建配置
│
├── README.md                   # 扩展说明文档
├── CHANGELOG.md               # 更新日志
├── LICENSE                     # 许可证文件
└── vsc-extension-quickstart.md # VS Code 快速开始指南
```

## 目录说明

### 核心目录

#### `src/` - 源代码目录
扩展的主要开发目录，包含所有 TypeScript 源代码。

- **`extension.ts`** (必需)
  - 扩展的入口文件
  - 包含 `activate()` 和 `deactivate()` 函数
  - 注册命令、事件监听器等

- **`commands/`** - 命令实现
  - 将每个命令的实现分离到独立文件
  - 提高代码可维护性

- **`utils/`** - 工具函数
  - 通用工具函数
  - 状态管理
  - API 调用封装

- **`services/`** - 服务层
  - 业务逻辑封装
  - 外部服务集成（如 YAPI、GitHub API 等）

- **`providers/`** - VS Code API 提供者
  - `CompletionItemProvider` - 代码补全
  - `HoverProvider` - 悬停提示
  - `DocumentSymbolProvider` - 文档符号
  - `CodeActionProvider` - 代码操作
  - `TreeDataProvider` - 树形视图数据

- **`views/`** - 视图相关
  - Webview 面板实现
  - TreeView 数据提供者
  - 自定义视图组件

- **`types/`** - 类型定义
  - TypeScript 接口和类型
  - 共享类型定义

- **`test/`** - 测试文件
  - 单元测试
  - 集成测试

### 资源目录

#### `resources/` - 静态资源
存放扩展使用的静态文件：
- **`icons/`** - 图标文件（用于命令、状态栏等）
- **`images/`** - 图片资源
- **`templates/`** - 代码模板、配置文件模板等

#### `media/` - 媒体文件
用于文档展示的图片、GIF 等，通常用于 README.md

### 输出目录

#### `dist/` - 编译输出
- 编译后的 JavaScript 文件
- Source map 文件
- **注意**: 通常添加到 `.gitignore`

#### `out/` - TypeScript 输出
- 如果使用 `tsc` 编译，输出到此目录
- **注意**: 通常添加到 `.gitignore`

### 配置文件

#### `.vscode/` - VS Code 工作区配置
- **`launch.json`** - 调试配置
- **`tasks.json`** - 任务配置（编译、打包等）
- **`extensions.json`** - 推荐的开发扩展

#### 根目录配置文件
- **`package.json`** - 扩展清单（必需）
  - 定义扩展元数据
  - 注册命令、配置、视图等
  - 声明依赖

- **`tsconfig.json`** - TypeScript 配置
- **`eslint.config.mjs`** - ESLint 配置
- **`esbuild.js`** - 构建工具配置

## 当前项目目录结构

```
qdll-generate-yapi/
├── src/
│   ├── extension.ts          # ✅ 扩展入口
│   ├── utils/                # ✅ 工具函数
│   │   ├── common.ts
│   │   ├── stateManager.ts
│   │   └── yapi.ts
│   └── test/                 # ✅ 测试文件
│       └── extension.test.ts
├── dist/                     # ✅ 编译输出
├── package.json              # ✅ 扩展清单
├── tsconfig.json             # ✅ TypeScript 配置
└── README.md                 # ✅ 说明文档
```

## 推荐的最佳实践

### 1. 目录组织原则
- **按功能模块划分**：将相关功能放在同一目录
- **职责分离**：命令、服务、工具函数分开
- **可扩展性**：预留常用目录，便于后续扩展

### 2. 命名规范
- 使用小写字母和连字符：`state-manager.ts`
- 或使用驼峰命名：`stateManager.ts`（当前项目使用）
- 保持一致性

### 3. 文件组织
- 每个命令一个文件
- 每个服务一个文件
- 工具函数按功能分组

### 4. 忽略文件
确保 `.gitignore` 包含：
```
node_modules/
dist/
out/
*.vsix
.vscode-test/
```

## 扩展建议

根据当前项目，可以考虑添加以下目录：

```
src/
├── commands/          # 将命令实现分离
│   └── generateAPI.ts
├── services/          # 业务服务层
│   └── yapiService.ts
├── types/            # 类型定义
│   └── yapi.d.ts
└── resources/        # 静态资源
    └── templates/    # API 模板文件
```

## 参考资源

- [VS Code Extension API](https://code.visualstudio.com/api)
- [Extension Guidelines](https://code.visualstudio.com/api/references/extension-guidelines)
- [Extension Manifest](https://code.visualstudio.com/api/references/extension-manifest)

