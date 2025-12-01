import * as vscode from 'vscode';
import { TerminalService } from '../services/terminalService';

export const generateAPICommand = vscode.commands.registerCommand('qdll-generate-yapi.generateAPI', async () => {
    vscode.window.showInformationMessage(`Generate API from qdll-generate-yapi!`);
    const terminalService = new TerminalService();
    terminalService.start();
});