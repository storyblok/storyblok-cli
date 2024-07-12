import chalk from "chalk";
import fs from "fs";
import type { GenerateTypescriptTypedefsCLIOptions, JSONSchemaToTSOptions } from "../types";
import { GenerateTypesFromJSONSchemas } from "../utils/typescript/generateTypesFromJSONSchema";
import type { JSONSchema } from "json-schema-to-typescript";
import { glob } from "glob";

type GenerateTSTypedefs = (options: GenerateTypescriptTypedefsCLIOptions) => void;

const generateTypescriptTypedefs: GenerateTSTypedefs = async ({
  sourceFilePaths,
  destinationFilePath = "./storyblok-component-types.d.ts",
  typeNamesPrefix,
  typeNamesSuffix = "Storyblok",
  customFieldTypesParserPath,
  JSONSchemaToTSOptionsPath,
}) => {
  /**
   * Get JSON Schemas from files looking at all the paths provided
   * @param paths An array of paths to read from
   * @returns An array of components JSONSchemas
   */
  const getJSONSchemasFromPaths = (paths: string[]): JSONSchema[] | null => {
    try {
      return paths.map((sourceFilePath) => JSON.parse(fs.readFileSync(sourceFilePath, "utf8")));
    } catch (e) {
      console.error(
        `${chalk.red("X")}
        Could not load JSON files from the provided paths: ${paths}. Please check if those files exist.`
      );
      return null;
    }
  };

  /**
   * Get user-provided options for json-schema-to-typescript https://www.npmjs.com/package/json-schema-to-typescript#options
   * @param path Path to a JSON file with the options
   * @returns A POJO with the options
   */
  const getJSONSchemaToTSOptionsFromPath = (path: string): Record<string, any> | null => {
    try {
      return JSON.parse(fs.readFileSync(path, "utf8"));
    } catch (e) {
      console.error(
        `${chalk.red("X")}
        Could not load options from the JSON file at ${path}. Please check if the file exists and if it's properly formatted.`
      );
      return null;
    }
  };

  const JSONSchemaToTSCustomOptions =
    JSONSchemaToTSOptionsPath && getJSONSchemaToTSOptionsFromPath(JSONSchemaToTSOptionsPath);

  // Merge custom provided options to our defaults
  const JSONSchemaToTSOptions: JSONSchemaToTSOptions = {
    bannerComment: "", // Remove much noise from the Typedefs file
    unknownAny: false, // Smoother transition from a non-TS codebase to a TS codebase
    ...JSONSchemaToTSCustomOptions,
  };

  const componentsJSONSchemaArray = getJSONSchemasFromPaths(await glob(sourceFilePaths))?.flatMap(
    (componentsJSONSchema) => componentsJSONSchema.components || componentsJSONSchema
  );

  if (componentsJSONSchemaArray && componentsJSONSchemaArray.length > 0) {
    const generator = await GenerateTypesFromJSONSchemas.init(componentsJSONSchemaArray, {
      sourceFilePaths,
      destinationFilePath,
      typeNamesPrefix,
      typeNamesSuffix,
      customFieldTypesParserPath,
      JSONSchemaToTSCustomOptions: JSONSchemaToTSOptions,
    });

    return await generator.generateTSFile();
  }
};

export default generateTypescriptTypedefs;
