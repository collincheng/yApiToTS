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
      this.yApiService = new YApiService(
        configInfo.username,
        configInfo.password
      );
      await this.yApiService.login();
      this.print("✅ Login successfully");
      const selectedGroup = await this.selectGroup();
      if (!selectedGroup) {
        return;
      }
      const selectedProject = await this.selectProject(selectedGroup.value);
      if (!selectedProject) {
        return;
      }
      const selectedMenu = await this.selectMenu(selectedProject.value);
      if (selectedMenu) {
        if (selectedMenu.list.length === 0) {
          vscode.window.showErrorMessage("该菜单下没有接口");
          return;
        }
        this.print("🔑 Basepath: " + selectedProject.basepath);
        this.print("当前有" + selectedMenu.list.length + "个接口");
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
    // 过滤掉废弃的吧
    const selectedGroupList = groupList
      .map((group) => ({
        label: group.group_name,
        value: group._id,
      }))
      .filter((item) => !item.label.includes("废弃了"));
    const selectedGroup = await vscode.window.showQuickPick(selectedGroupList, {
      placeHolder: "Select a group",
      canPickMany: false,
    });
    return selectedGroup;
  }

  private async selectProject(groupId: number) {
    if (!this.yApiService) {
      vscode.window.showErrorMessage("YApi服务未初始化");
      return;
    }
    const projectList = await this.yApiService.getProjectListById(groupId);
    this.print("🔑 Project list: " + JSON.stringify(projectList));
    const selectedProjectList = projectList.map((project) => ({
      label: project.name,
      value: project._id,
      basepath: project.basepath,
    }));
    const selectedProject = await vscode.window.showQuickPick(
      selectedProjectList,
      {
        placeHolder: "Select a project",
        canPickMany: false,
      }
    );
    return selectedProject;
  }

  private async selectMenu(projectId: number) {
    if (!this.yApiService) {
      vscode.window.showErrorMessage("YApi服务未初始化");
      return;
    }
    this.print("🔑 Project ID: " + projectId);
    const menuList = await this.yApiService.getMenuListById(projectId);
    this.print("🔑 Menu list: " + JSON.stringify(menuList));
    const selectedMenuList = menuList.map((menu) => ({
      label: menu.desc,
      value: menu._id,
      list: menu.list,
    }));
    const selectedMenu = await vscode.window.showQuickPick(selectedMenuList, {
      placeHolder: "Select a menu",
      canPickMany: false,
    });
    return selectedMenu;
  }

  private print(message: string) {
    this.outputChannel.appendLine(message);
  }
}
