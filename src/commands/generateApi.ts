import * as vscode from 'vscode';
import { TerminalService } from '../services/terminalService';

export const generateAPICommand = vscode.commands.registerCommand('qdll-generate-yapi.generateAPI', async () => {
    const terminalService = new TerminalService();
    terminalService.start();
});