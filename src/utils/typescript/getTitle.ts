import lodash from "lodash";
const { camelCase, startCase } = lodash;

const storyDataTypeName = "ISbStoryData";

export const getTitle = (t: string, options?: any) =>
  startCase(camelCase(`${options.titlePrefix ?? ""}${t}${options.titleSuffix}`)).replace(/ /g, "");

export const getStoryTypeTitle = (t: string, options?: any) => `${storyDataTypeName}<${getTitle(t, options)}>`;
