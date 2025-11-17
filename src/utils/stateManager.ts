import * as vscode from 'vscode';

/**
 * VS Code 插件全局状态管理工具类
 * 
 * 提供了多种状态存储方式：
 * 1. globalState - 跨工作区的全局状态
 * 2. workspaceState - 当前工作区状态
 * 3. secrets - 敏感信息（如 API keys）
 */
export class StateManager {
	private static instance: StateManager | undefined;
	private context: vscode.ExtensionContext;

	private constructor(context: vscode.ExtensionContext) {
		this.context = context;
	}

	/**
	 * 获取单例实例
	 */
	static getInstance(context?: vscode.ExtensionContext): StateManager {
		if (!StateManager.instance) {
			if (!context) {
				throw new Error('StateManager must be initialized with context first');
			}
			StateManager.instance = new StateManager(context);
		}
		return StateManager.instance;
	}

	/**
	 * 全局状态（跨所有工作区）
	 * 适合存储：用户设置、全局配置等
	 */
	getGlobalState<T>(key: string): T | undefined {
		return this.context.globalState.get<T>(key);
	}

	async setGlobalState<T>(key: string, value: T): Promise<void> {
		await this.context.globalState.update(key, value);
	}

	async deleteGlobalState(key: string): Promise<void> {
		await this.context.globalState.update(key, undefined);
	}

	/**
	 * 工作区状态（仅当前工作区）
	 * 适合存储：工作区特定配置、临时数据等
	 */
	getWorkspaceState<T>(key: string): T | undefined {
		return this.context.workspaceState.get<T>(key);
	}

	async setWorkspaceState<T>(key: string, value: T): Promise<void> {
		await this.context.workspaceState.update(key, value);
	}

	async deleteWorkspaceState(key: string): Promise<void> {
		await this.context.workspaceState.update(key, undefined);
	}

	/**
	 * 敏感信息存储（如 API keys、tokens）
	 * 数据会被加密存储
	 */
	async getSecret(key: string): Promise<string | undefined> {
		return await this.context.secrets.get(key);
	}

	async setSecret(key: string, value: string): Promise<void> {
		await this.context.secrets.store(key, value);
	}

	async deleteSecret(key: string): Promise<void> {
		await this.context.secrets.delete(key);
	}

	/**
	 * 获取全局存储路径
	 * 可以用于存储文件等
	 */
	getGlobalStorageUri(): vscode.Uri {
		return this.context.globalStorageUri;
	}

	/**
	 * 获取工作区存储路径
	 * 注意：workspaceStorageUri 在某些 VS Code 版本中可能不可用
	 * 可以使用 globalStorageUri 作为替代
	 */
	getWorkspaceStorageUri(): vscode.Uri {
		// 如果 workspaceStorageUri 存在则使用，否则使用 globalStorageUri
		return (this.context as any).workspaceStorageUri || this.context.globalStorageUri;
	}

	/**
	 * 清除所有全局状态
	 */
	async clearGlobalState(): Promise<void> {
		// 获取所有 keys 并删除
		const keys = this.context.globalState.keys();
		for (const key of keys) {
			await this.deleteGlobalState(key);
		}
	}

	/**
	 * 清除所有工作区状态
	 */
	async clearWorkspaceState(): Promise<void> {
		const keys = this.context.workspaceState.keys();
		for (const key of keys) {
			await this.deleteWorkspaceState(key);
		}
	}
}

