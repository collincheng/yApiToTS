import * as vscode from "vscode";
import { TerminalService } from "../services/terminalService";
import { ConfigInfo } from "../utils/configInfo";
import { CONFIG_FILE_NAME } from "../constant";

const readConfigFile = () => {
  const configInfo = ConfigInfo.getConfigInfo();
  if (!configInfo || !configInfo.password || !configInfo.username) {
    vscode.window.showErrorMessage(
      `${CONFIG_FILE_NAME} config file is invalid`
    );
    return null;
  }
  return configInfo;
};

export const generateAPICommand = vscode.commands.registerCommand(
  "qdll-generate-yapi.generateAPI",
  () => {
    const outputChannel =
      vscode.window.createOutputChannel("QDLL YAPI Terminal");
    outputChannel.show();
    outputChannel.appendLine("🚀 Starting QDLL YAPI Terminal...");
    outputChannel.appendLine("Reading config file...");
    const configInfo = readConfigFile();
    if (!configInfo) {
      return;
    }
    outputChannel.appendLine("Config file read successfully");
    const terminalService = new TerminalService(configInfo, outputChannel);
    terminalService.start();
  }
);
