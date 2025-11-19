import * as vscode from 'vscode';

export const generateAPICommand = vscode.commands.registerCommand('qdll-generate-yapi.generateAPI', async () => {
    vscode.window.showInformationMessage(`Generate API from qdll-generate-yapi!`);
});