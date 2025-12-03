// @ts-ignore
import * as changeCase from "change-case";
import { translate } from "@vitalets/google-translate-api";

export const zhToEnVar = async (text: string) => {
  const { text: en } = await translate(text, { to: "en" });
  return changeCase.camelCase(en);
};

