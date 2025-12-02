import * as vscode from "vscode";
import { ConfigInfo } from "../utils/configInfo";
import { CONFIG_FILE_NAME } from "../constant";
import { YApiService } from "./yApiService";

export class TerminalService {
  private readonly outputChannel: vscode.OutputChannel;
  private yApiService: YApiService | null = null;

  constructor() {
    // 创建输出通道
    this.outputChannel =
      vscode.window.createOutputChannel("QDLL YAPI Terminal");
  }

  async start() {
    this.outputChannel.show();
    this.print("🚀 Starting QDLL YAPI Terminal...");
    const configInfo = this.readConfigFile();
    if (configInfo) {
      this.print("🔑 Config file read successfully");
      this.print("🔑 Username: " + configInfo.username);
      this.print("🔑 Password: " + configInfo.password);
      this.yApiService = new YApiService(
        configInfo.username,
        configInfo.password
      );
      await this.yApiService.login();
      this.print("🔑 Login successfully");
      const selectedGroup = await this.selectGroup();
      if (selectedGroup) {
        this.print("🔑 Selected group: " + JSON.stringify(selectedGroup));
      }
    }
  }

  private readConfigFile() {
    this.print("步骤1: 读取配置文件");
    const configInfo = ConfigInfo.getConfigInfo();
    // 检查配置文件是否有效
    if (!configInfo || !configInfo.password || !configInfo.username) {
      vscode.window.showErrorMessage(
        `${CONFIG_FILE_NAME} config file is invalid`
      );
      return false;
    }
    this.print("✅ 配置文件读取成功");
    return configInfo;
  }

  private async selectGroup() {
    if (!this.yApiService) {
      vscode.window.showErrorMessage("YApi服务未初始化");
      return;
    }
    const groupList = await this.yApiService.getGroupList();
    const selectedGroupList = groupList.map((group) => ({
      label: group.group_name,
      value: group._id,
    }));
    this.print("🔑 Group list: " + JSON.stringify(selectedGroupList));
    const selectedGroup = (await vscode.window.showQuickPick(
      selectedGroupList,
      {
        placeHolder: "Select a group",
        canPickMany: false,
      }
    )) as string | undefined;
    return selectedGroup;
  }

  private print(message: string) {
    this.outputChannel.appendLine(message);
  }
}
