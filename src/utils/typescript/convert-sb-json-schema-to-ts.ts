import type { JSONSchema } from "json-schema-to-typescript";
import { TYPES, generate } from "./genericTypes";
import { StoryblokSchemaElement } from "./typings";
import chalk from "chalk";

// TOKENS
const storyDataTypeName = "ISbStoryData";

type GenerateTSTypedefsOptions = {
  sourceFilePaths: string;
  destinationFilePath?: string;
  titlePrefix?: string;
  titleSuffix?: string;
  customTypeParser?: string;
};

export const generateTSTypedefsFromComponentsJSONSchema = async (
  componentsJSONSchema: JSONSchema[],
  options: GenerateTSTypedefsOptions
) => {
  console.log(chalk.green("✓") + " Generating TS typedefs ***");
  let ctp: any;
  if (options.customTypeParser) {
    ctp = await import(options.customTypeParser);
  }

  const typesImport = [`import type { ${storyDataTypeName} } from "storyblok";`];
  const getTitle = (t: string) => `${options.titlePrefix ?? ""}${t}${options.titleSuffix}`;
  const getStoryTypeTitle = (t: string) => `${storyDataTypeName}<${getTitle(t)}>`;

  const { componentGroups, componentNames } = componentsJSONSchema.reduce(
    (acc, currentComponent) => {
      if (currentComponent.component_group_uuid)
        acc.componentGroups.set(
          currentComponent.component_group_uuid,
          acc.componentGroups.has(currentComponent.component_group_uuid)
            ? acc.componentGroups.get(currentComponent.component_group_uuid)!.add(currentComponent.name)
            : new Set([currentComponent.name])
        );

      acc.componentNames.add(currentComponent.name);
      return acc;
    },
    { componentGroups: new Map(), componentNames: new Set() } as {
      componentGroups: Map<string, Set<string>>;
      componentNames: Set<string>;
    }
  );
  console.log({ componentGroups, componentNames });

  const typeMapper = async (schema: JSONSchema = {}, title: string) => {
    const parseObj = {};

    for (const key of Object.keys(schema)) {
      // exclude tab-* elements as they are used in storybloks ui and do not affect the data structure
      if (key.startsWith("tab-")) {
        continue;
      }

      const obj: JSONSchema = {};
      const schemaElement = schema[key];
      const type = schemaElement.type;

      if (TYPES.includes(type)) {
        const ts = await generate(type, getTitle(type), {});

        if (ts) {
          typesImport.push(ts);
        }
      } else if (type === "custom") {
        Object.assign(parseObj, {}); // defaultCustomMapper(key, schemaElement)

        if (typeof ctp === "function") {
          Object.assign(parseObj, ctp(key, schemaElement));
        }

        continue;
      }

      const element = parseSchema(schemaElement);

      if (!element) {
        continue;
      }

      obj[key] = element;

      if (type === "multilink") {
        const excludedLinktypes = [];
        const baseType = getTitle(type);

        if (!schemaElement.email_link_type) {
          excludedLinktypes.push('{ linktype?: "email" }');
        }
        if (!schemaElement.asset_link_type) {
          excludedLinktypes.push('{ linktype?: "asset" }');
        }

        obj[key].tsType = excludedLinktypes.length
          ? `Exclude<${baseType}, ${excludedLinktypes.join(" | ")}>`
          : baseType;
      } else if (TYPES.includes(type)) {
        obj[key].tsType = getTitle(type);
      } else if (type === "bloks") {
        if (schemaElement.restrict_components) {
          if (schemaElement.restrict_type === "groups") {
            if (
              Array.isArray(schemaElement.component_group_whitelist) &&
              schemaElement.component_group_whitelist.length
            ) {
              let currentGroupElements: string[] = [];
              schemaElement.component_group_whitelist.forEach((groupId: string) => {
                const currentGroup = componentGroups.get(groupId);
                if (Array.isArray(currentGroup)) {
                  currentGroupElements = [...currentGroupElements, ...currentGroup];
                } else {
                  console.log("Group has no members: ", groupId);
                }
              });
              if (currentGroupElements.length == 0) {
                obj[key].tsType = `never[]`;
              } else {
                obj[key].tsType = `(${currentGroupElements.join(" | ")})[]`;
              }
            }
          } else {
            if (Array.isArray(schemaElement.component_whitelist) && schemaElement.component_whitelist.length) {
              obj[key].tsType = `(${schemaElement.component_whitelist.map((i: string) => getTitle(i)).join(" | ")})[]`;
            } else {
              console.log("No whitelisted component found");
            }
          }
        } else {
          console.log("Type: bloks array but not whitelisted (will result in all elements):", title);
          obj[key].tsType = `(${Array.from(componentNames).join(" | ")})[]`;
        }
      }
      Object.assign(parseObj, obj);
    }

    return parseObj;
  };

  function parseSchema(element: StoryblokSchemaElement): {
    type?: string | string[];
    tsType?: string;
    [key: string]: any;
  } {
    if (TYPES.includes(element.type)) {
      return {
        type: element.type,
      };
    }

    let type: string | string[] = "any";
    let options: string[] = [];

    if (Array.isArray(element.options) && element.options.length) {
      options = element.options.map((item) => item.value);
    }

    if (options.length && element.exclude_empty_option !== true) {
      options.unshift("");
    }

    // option types with source self do not have a source field but the options as array
    if (!element.source && element.options !== undefined) {
      type = "string";
    }

    // if source to internal stories is not restricted we cannot know about the type contained
    if (element.source === "internal_stories" && element.filter_content_type === undefined) {
      type = "any";
    }

    if (element.source === "internal_stories" && element.filter_content_type) {
      if (element.type === "option") {
        if (Array.isArray(element.filter_content_type)) {
          return {
            tsType: `(${element.filter_content_type.map((type2) => getStoryTypeTitle(type2)).join(" | ")} | string )`,
          };
        } else {
          return {
            tsType: `(${getStoryTypeTitle(element.filter_content_type)} | string )`,
          };
        }
      }

      if (element.type === "options") {
        if (Array.isArray(element.filter_content_type)) {
          return {
            tsType: `(${element.filter_content_type.map((type2) => getStoryTypeTitle(type2)).join(" | ")} | string )[]`,
          };
        } else {
          return {
            tsType: `(${getStoryTypeTitle(element.filter_content_type)} | string )[]`,
          };
        }
      }
    }

    // datasource and language options are always returned as string
    if (element.source === "internal_languages") {
      type = "string";
    }

    if (element.source === "internal") {
      type = ["number", "string"];
    }

    if (element.source === "external") {
      type = "string";
    }

    if (element.type === "option") {
      if (options.length) {
        return {
          type,
          enum: options,
        };
      }

      return {
        type,
      };
    }

    if (element.type === "options") {
      if (options.length) {
        return {
          type: "array",
          items: {
            enum: options,
          },
        };
      }

      return {
        type: "array",
        items: { type: type },
      };
    }

    switch (element.type) {
      case "text":
        return { type: "string" };
      case "bloks":
        return { type: "array" };
      case "number":
        return { type: "string" };
      case "image":
        return { type: "string" };
      case "boolean":
        return { type: "boolean" };
      case "textarea":
        return { type: "string" };
      case "markdown":
        return { type: "string" };
      case "datetime":
        return { type: "string" };
      default:
        return { type: "any" };
    }
  }
};
