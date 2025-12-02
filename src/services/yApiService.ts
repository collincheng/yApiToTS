import * as vscode from "vscode";

export interface Group {
  add_time: number;
  group_name: string;
  _id: number;
}

interface Project {
  name: string;
  _id: number;
}

export class YApiService {
  private readonly username: string;
  private readonly password: string;
  private readonly baseURL: string;
  private token: string | null = null;
  private uid: string | null = null;
  private cookie: string = "";

  constructor(username: string, password: string) {
    this.username = username;
    this.password = password;
    this.baseURL = "https://yapi.dingdanll.com";
  }

  async login() {
    const response = await fetch(`${this.baseURL}/api/user/login`, {
      method: "POST",
      body: JSON.stringify({ email: this.username, password: this.password }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    console.log(response);
    const token = await this.getToken(response);
    this.token = token;
    this.uid = ((await response.json()) as { data: any }).data.uid;
    this.cookie = `_yapi_token=${this.token}; _yapi_uid=${this.uid}`;
    return token;
  }

  async getGroupList() {
    try {
      const response = await fetch(`${this.baseURL}/api/group/list`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Cookie: this.cookie,
        },
      });
      const res = (await response.json()) as { data: Group[] };
      return res.data;
    } catch (error) {
      vscode.window.showErrorMessage("获取分组列表失败: " + error);
      return [];
    }
  }

  async getProjectListById(id: number) {
    const response = await fetch(
      `${this.baseURL}/api/project/list?group_id=${id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Cookie: this.cookie,
        },
      }
    );
    const res = (await response.json()) as { data: { list: Project[] } };
    return res.data.list;
  }

  private async getToken(response: Response) {
    const data = await response.headers.get("set-cookie");
    if (!data) {
      throw new Error("No token found");
    }

    return data.split(";")[0].split("=")[1];
  }
}
