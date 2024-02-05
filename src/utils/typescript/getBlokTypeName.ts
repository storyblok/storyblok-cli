import lodash from "lodash";
import { GenerateTypescriptTypedefsCLIOptions } from "../../types";
const { camelCase, startCase } = lodash;

const storyDataTypeName = "ISbStoryData";

export const getBlokTypeName = (blokName: string, options: GenerateTypescriptTypedefsCLIOptions) =>
  startCase(camelCase(`${options.typeNamesPrefix ?? ""}${blokName}${options.typeNamesSuffix}`)).replace(/ /g, "");

export const getStoryType = (storyBlokName: string, options: GenerateTypescriptTypedefsCLIOptions) =>
  `${storyDataTypeName}<${getBlokTypeName(storyBlokName, options)}>`;
