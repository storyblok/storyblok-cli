import lodash from "lodash";
import { GenerateTypescriptTypedefsCLIOptions } from "../../types";
const { camelCase, startCase } = lodash;

const storyDataTypeName = "ISbStoryData";

export const getBlokTypeName = (blokName: string, options: GenerateTypescriptTypedefsCLIOptions) =>
  startCase(camelCase(`${options.titlePrefix ?? ""}${blokName}${options.titleSuffix}`)).replace(/ /g, "");

export const getStoryTypeTitle = (t: string, options?: any) => `${storyDataTypeName}<${getBlokTypeName(t, options)}>`;
