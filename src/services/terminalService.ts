import * as vscode from "vscode";
import { ConfigInfoRes } from "../utils/configInfo";
import { YApiService } from "./yApiService";
import { compile } from "json-schema-to-typescript";
import fs from "fs";
import path from "path";

export class TerminalService {
  private readonly outputChannel: vscode.OutputChannel;
  private yApiService: YApiService; // 使用非空断言，确保一定有值

  constructor(configInfo: ConfigInfoRes, outputChannel: vscode.OutputChannel) {
    this.outputChannel = outputChannel;
    this.yApiService = new YApiService(configInfo.username, configInfo.password);
  }

  async start() {
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
      this.print("Basepath: " + selectedProject.basepath);
      this.print("当前有" + selectedMenu.list.length + "个接口");
      for (const api of selectedMenu.list) {
        const apiDetail = await this.getApiDetail(api._id);
        if (apiDetail) {
          this.print("🔑 API Detail: " + JSON.stringify(apiDetail));
          const _reqBody = JSON.parse(apiDetail.req_body_other);
          const workspaceFolder =
            vscode.workspace.workspaceFolders?.[0]?.uri.fsPath || process.cwd();
          const absoluteWorkspaceFolder = path.resolve(workspaceFolder);
          compile(_reqBody, "ReqBody", {
            additionalProperties: false,
            bannerComment: "",
          })
            .then((res) => {
              fs.writeFileSync(
                path.resolve(absoluteWorkspaceFolder, "reqBody.d.ts"),
                res
              );
            })
            .catch((err) => {
              this.print(
                "🔑 ReqBody Error: " +
                  (err instanceof Error ? err.message : String(err))
              );
              this.print(
                "🔑 ReqBody Stack: " + (err instanceof Error ? err.stack : "")
              );
            });
        }
      }
    }
  }

  private async selectGroup() {
    const groupList = await this.yApiService.getGroupList();
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
    const projectList = await this.yApiService.getProjectListById(groupId);
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
    const menuList = await this.yApiService.getMenuListById(projectId);
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

  private async getApiDetail(apiId: number) {
    const apiDetail = await this.yApiService.getApiDetailById(apiId);
    return apiDetail;
  }

  private print(message: string) {
    this.outputChannel.appendLine(message);
  }
}
