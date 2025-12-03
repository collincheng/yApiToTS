import path from "path";
import * as vscode from "vscode";

export const CONFIG_FILE_NAME = "YAPI";

export const absoluteWorkspaceFolder = path.resolve(
  vscode.workspace.workspaceFolders?.[0]?.uri.fsPath || process.cwd()
);
