import * as vscode from 'vscode';
import { ConfigInfo } from '../utils/configInfo';
import { CONFIG_FILE_NAME } from '../constant';
import { YApiService } from './yApiService';

export class TerminalService {
    private readonly outputChannel: vscode.OutputChannel;

    constructor() {
        // 创建输出通道
        this.outputChannel = vscode.window.createOutputChannel('QDLL YAPI Terminal');
    }

    start() {
        this.outputChannel.show();
        this.print('🚀 Starting QDLL YAPI Terminal...');
        const configInfo = this.readConfigFile();
        if (configInfo) {
            this.print('🔑 Config file read successfully');
            this.print('🔑 Username: ' + configInfo.username);
            this.print('🔑 Password: ' + configInfo.password);
            const yApiService = new YApiService(configInfo.username, configInfo.password);
            yApiService.login().then((res) => {
                this.print('🔑 Login successfully');
                this.print('🔑 Token: ' + res);
            }).catch((err) => {
                this.print('❌ Login failed');
                this.print('❌ Error: ' + err);
            });
        }
    }

    private readConfigFile() {
        this.print('步骤1: 读取配置文件');
        const configInfo = ConfigInfo.getConfigInfo();
        // 检查配置文件是否有效
        if (!configInfo || (!configInfo.password || !configInfo.username)) {
            vscode.window.showErrorMessage(`${CONFIG_FILE_NAME} config file is invalid`);
            return false;
        }
        this.print('✅ 配置文件读取成功');
        return configInfo;
    }

    private print(message: string) {
        this.outputChannel.appendLine(message);
    }

}