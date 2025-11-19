import * as vscode from 'vscode';
import { ConfigInfo } from '../utils/configInfo';
import { CONFIG_FILE_NAME } from '../constant';

export class TerminalService {
    private readonly outputChannel: vscode.OutputChannel;

    constructor() {
        // 创建输出通道
        this.outputChannel = vscode.window.createOutputChannel('QDLL YAPI Terminal');
    }

    start() {
        this.outputChannel.show();
        this.print('🚀 Starting QDLL YAPI Terminal...');
        const configInfo = ConfigInfo.getConfigInfo();
        this.print('configInfo: ' + JSON.stringify(configInfo));
        // 检查配置文件是否有效
        if (!configInfo || (!configInfo.password || !configInfo.username)) {
            vscode.window.showErrorMessage(`${CONFIG_FILE_NAME} config file is invalid`);
            return;
        }
    }

    private print(message: string) {
        this.outputChannel.appendLine(message);

    }

}