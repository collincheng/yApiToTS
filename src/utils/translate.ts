// @ts-ignore
import * as changeCase from "change-case";
import * as vscode from "vscode";

const DEEPSEEK_API_URL = "https://api.deepseek.com/v1/chat/completions";
const DEEPSEEK_API_KEY_SECRET = "sk-da4d37b853434564b333826499eb42d2";

interface DeepSeekResponse {
  choices?: Array<{
    message?: {
      content?: string;
    };
  }>;
}

/**
 * 使用 DeepSeek API 翻译中文到英文
 * @param text 待翻译的中文文本
 * @param apiKey 可选的 API key，如果不提供则从 StateManager 获取或提示用户输入
 */
export const zhToEnVar = async (text: string): Promise<string> => {
  try {
    const response = await fetch(DEEPSEEK_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${DEEPSEEK_API_KEY_SECRET}`,
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: [
          {
            role: "user",
            content: `请将以下中文翻译成英文，只返回翻译结果，不要添加任何解释：${text}`,
          },
        ],
        temperature: 0.3,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`DeepSeek API 请求失败: ${response.status} ${errorText}`);
    }

    const data = (await response.json()) as DeepSeekResponse;
    const translatedText = data.choices?.[0]?.message?.content?.trim();

    if (!translatedText) {
      throw new Error("DeepSeek API 返回结果为空");
    }

    return changeCase.camelCase(translatedText);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    vscode.window.showErrorMessage(`翻译失败: ${errorMessage}`);
    throw error;
  }
};
