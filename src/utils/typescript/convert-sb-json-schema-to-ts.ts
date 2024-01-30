import { compile, type JSONSchema } from "json-schema-to-typescript";
import { TYPES, generate } from "./genericTypes";
import chalk from "chalk";
import fs from "fs";
import { parseBlokSchemaObject } from "./parseBlokSchemaObject";
import { getTitle } from "./getTitle";

// TOKENS
const storyDataTypeName = "ISbStoryData";

type GenerateTSTypedefsOptions = {
  sourceFilePaths: string;
  destinationFilePath?: string;
  titlePrefix?: string;
  titleSuffix?: string;
  customTypeParser?: string;
};

type ComponentGroupsAndNamesObject = {
  componentGroups: Map<string, Set<string>>;
  componentNames: Set<string>;
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

  const typedefsFileStringsArray = [`import type { ${storyDataTypeName} } from "storyblok";`];

  // Generate a Map with the components that have a parent group (groupname - Set(componentName)) and a Set with all the component names
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
    { componentGroups: new Map(), componentNames: new Set() } as ComponentGroupsAndNamesObject
  );

  async function generateTSFile() {
    for await (const component of componentsJSONSchema) {
      // By default all types will havea a required `_uid` and a required `component` properties
      const requiredFields = Object.entries<Record<string, any>>(component.schema).reduce(
        (acc, [key, value]) => {
          if (value.required) {
            return [...acc, key];
          }
          return acc;
        },
        ["_uid", "component"]
      );

      const title = getTitle(component.name, options);
      const obj: JSONSchema = {
        $id: `#/${component.name}`,
        title,
        type: "object",
        required: requiredFields,
      };

      obj.properties = await typeMapper(component.schema, title);
      obj.properties._uid = {
        type: "string",
      };
      obj.properties.component = {
        type: "string",
        enum: [component.name],
      };

      try {
        const ts = await compile(obj, component.name, {} /*compilerOptions*/);
        typedefsFileStringsArray.push(ts);
      } catch (e) {
        console.log("ERROR", e);
      }
    }
  }

  /**
   * This function maps schema of properties to a
   * @param schema
   * @param title
   * @returns
   */
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

      // Generate type for storyblok-provided types
      if (TYPES.includes(type)) {
        const ts = await generate(type, getTitle(type, options), {});

        if (ts) {
          typedefsFileStringsArray.push(ts);
        }
        // Generate type for custom field
      } else if (type === "custom") {
        Object.assign(parseObj, {}); // defaultCustomMapper(key, schemaElement)

        if (typeof ctp === "function") {
          Object.assign(parseObj, ctp(key, schemaElement));
        }

        continue;
      }

      const element = parseBlokSchemaObject(schemaElement, options);

      if (!element) {
        continue;
      }

      obj[key] = element;

      if (type === "multilink") {
        const excludedLinktypes = [];
        const baseType = getTitle(type, options);

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
        obj[key].tsType = getTitle(type, options);
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
              obj[key].tsType = `(${schemaElement.component_whitelist
                .map((i: string) => getTitle(i, options))
                .join(" | ")})[]`;
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

  await generateTSFile();

  if (options.destinationFilePath) {
    fs.writeFileSync(options.destinationFilePath, typedefsFileStringsArray.join("\n"));
  }

  return typedefsFileStringsArray;
};
