import * as vscode from "vscode";
import { ConfigInfoRes } from "../utils/configInfo";
import { YApiService } from "./yApiService";
import path from "path";
import { zhToEnVar } from "../utils/translate";
import {
  generateFiles,
  generateFunction,
  generateTypes,
  generateFunctionImport,
} from "../utils/generate";
import { absoluteWorkspaceFolder } from "../constant";
import fs from "fs";

export class TerminalService {
  private readonly outputChannel: vscode.OutputChannel;
  private yApiService: YApiService;
  private configInfo: ConfigInfoRes;

  constructor(configInfo: ConfigInfoRes, outputChannel: vscode.OutputChannel) {
    this.outputChannel = outputChannel;
    this.configInfo = configInfo;
    this.yApiService = new YApiService(
      configInfo.username,
      configInfo.password
    );
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
      this.print("menuName: " + selectedMenu.label);
      this.print("当前有" + selectedMenu.list.length + "个接口");
      const folderName = await zhToEnVar(selectedMenu.label);
      const folderPath = path.join(
        absoluteWorkspaceFolder + this.configInfo.outputPath + "/" + folderName
      );
      generateFiles(folderPath);
      let typesContent = "";
      let functionContent = "";
      const apiNameList = [];
      for (const api of selectedMenu.list) {
        const apiDetail = await this.getApiDetail(api._id);
        if (apiDetail) {
          const name = await zhToEnVar(apiDetail.title);
          apiNameList.push(`${name}Params`, `${name}Res`);
          if (apiDetail.req_body_other) {
            const paramsType = await generateTypes(
              `${name}Params`,
              JSON.parse(apiDetail.req_body_other)
            );
            typesContent += paramsType + "\n";
          }
          const types = JSON.parse(apiDetail.res_body);
          const resType = await generateTypes(`${name}Res`, types);
          typesContent += resType + "\n";
          functionContent +=
            generateFunction({
              name,
              originName: apiDetail.title,
              url: selectedProject.basepath + apiDetail.path,
            }) + "\n";
        }
      }
      fs.writeFileSync(path.join(folderPath, "types.ts"), typesContent);
      fs.writeFileSync(
        path.join(folderPath, "apis.ts"),
        generateFunctionImport(apiNameList) + "\n" + functionContent
      );
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
