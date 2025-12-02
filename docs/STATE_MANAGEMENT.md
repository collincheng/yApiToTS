# VS Code 插件全局状态管理指南

## 概述

在 VS Code 插件中，有几种方式可以处理全局状态：

### 1. **GlobalState（全局状态）**
- **作用域**：跨所有工作区
- **用途**：用户设置、全局配置、跨项目共享的数据
- **持久化**：数据会持久保存，即使关闭 VS Code
- **示例**：用户偏好设置、API 端点配置

### 2. **WorkspaceState（工作区状态）**
- **作用域**：仅当前工作区
- **用途**：工作区特定配置、项目设置
- **持久化**：数据会持久保存，但仅对当前工作区有效
- **示例**：项目特定的配置、工作区临时数据

### 3. **Secrets（敏感信息）**
- **作用域**：跨所有工作区
- **用途**：API keys、tokens、密码等敏感信息
- **持久化**：数据会被加密存储
- **示例**：YAPI token、GitHub token

### 4. **StorageUri（存储路径）**
- **作用域**：全局或工作区
- **用途**：存储文件、缓存等
- **持久化**：文件系统存储

## 使用方法

### 初始化

```typescript
import { StateManager } from './utils/stateManager';

export function activate(context: vscode.ExtensionContext) {
  // 初始化状态管理器（单例模式）
  const stateManager = StateManager.getInstance(context);
}
```

### 基本操作

#### 全局状态

```typescript
// 保存全局状态
await stateManager.setGlobalState('user.preference', {
  theme: 'dark',
  language: 'zh-CN'
});

// 读取全局状态
const preference = stateManager.getGlobalState<{ theme: string }>('user.preference');

// 删除全局状态
await stateManager.deleteGlobalState('user.preference');
```

#### 工作区状态

```typescript
// 保存工作区状态
await stateManager.setWorkspaceState('project.config', {
  projectName: 'my-project',
  version: '1.0.0'
});

// 读取工作区状态
const config = stateManager.getWorkspaceState<{ projectName: string }>('project.config');

// 删除工作区状态
await stateManager.deleteWorkspaceState('project.config');
```

#### 敏感信息

```typescript
// 保存敏感信息（会被加密）
await stateManager.setSecret('api.token', 'your-secret-token');

// 读取敏感信息
const token = await stateManager.getSecret('api.token');

// 删除敏感信息
await stateManager.deleteSecret('api.token');
```

### 在类中使用

```typescript
import { StateManager } from './utils/stateManager';

export class MyService {
  constructor(private stateManager: StateManager) {}

  async saveSettings(settings: any) {
    await this.stateManager.setGlobalState('settings', settings);
  }

  getSettings() {
    return this.stateManager.getGlobalState('settings');
  }
}
```

## 最佳实践

1. **选择合适的存储方式**
   - 用户设置 → `globalState`
   - 项目配置 → `workspaceState`
   - 敏感信息 → `secrets`

2. **使用类型安全**
   ```typescript
   interface UserConfig {
     apiUrl: string;
     timeout: number;
   }
   
   const config = stateManager.getGlobalState<UserConfig>('config');
   ```

3. **错误处理**
   ```typescript
   try {
     await stateManager.setSecret('token', token);
   } catch (error) {
     vscode.window.showErrorMessage(`Failed to save token: ${error}`);
   }
   ```

4. **状态键命名规范**
   - 使用命名空间：`yapi.url`、`yapi.token`
   - 避免冲突：`extensionName.key`

## 注意事项

- `globalState` 和 `workspaceState` 只能存储可序列化的数据（JSON）
- `secrets` 只能存储字符串
- 所有异步操作都需要使用 `await`
- 状态数据在扩展卸载时不会自动清除

