import * as vscode from 'vscode';
import { CONFIG_FILE_NAME } from '../constant';
import path from 'path';
import fs from 'fs';

interface ConfigInfoRes{
    username: string;
    password: string;
}

export class ConfigInfo {
    static getConfigInfo(): ConfigInfoRes | null {
        const workspaceFolders = vscode.workspace.workspaceFolders;
        if (workspaceFolders && workspaceFolders.length > 0) {
            const rootPath = workspaceFolders[0].uri.fsPath;
            const configFile = path.join(rootPath, CONFIG_FILE_NAME + '.json');
            if (fs.existsSync(configFile)) {
                const configInfo = fs.readFileSync(configFile, 'utf8');
                return JSON.parse(configInfo) as ConfigInfoRes;
            }else{
                vscode.window.showWarningMessage(`${CONFIG_FILE_NAME} config file not found`);
            }
        }
        vscode.window.showWarningMessage(`No workspace folder found`);
        return null;
    }
}