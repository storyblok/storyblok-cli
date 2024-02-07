import lodash from "lodash";
import { GenerateTypescriptTypedefsCLIOptions } from "../../types";
const { camelCase, startCase } = lodash;

const storyDataTypeName = "ISbStoryData";

/**
 * Generate the Type name from the supplied blok name with the provided options
 * @param blokName The name of the blok (in snake_case)
 * @param options The CLI options (using only the prefix and suffix)
 * @returns A string with the Type name in PascalCase, as for Typescript standards
 */
export const getBlokTypeName = (blokName: string, options: GenerateTypescriptTypedefsCLIOptions) =>
  startCase(camelCase(`${options.typeNamesPrefix ?? ""}${blokName}${options.typeNamesSuffix}`)).replace(/ /g, "");

export const getStoryType = (storyBlokName: string, options: GenerateTypescriptTypedefsCLIOptions) =>
  `${storyDataTypeName}<${getBlokTypeName(storyBlokName, options)}>`;
