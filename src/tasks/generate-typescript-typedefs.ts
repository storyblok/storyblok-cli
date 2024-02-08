import chalk from "chalk";
import fs from "fs";
import type { GenerateTypescriptTypedefsCLIOptions, JSONSchemaToTSOptions } from "../types";
import { GenerateTypesFromJSONSchemas } from "../utils/typescript/generateTypesFromJSONSchema";

type GenerateTSTypedefs = (options: GenerateTypescriptTypedefsCLIOptions) => void;

const generateTypescriptTypedefs: GenerateTSTypedefs = async ({
  sourceFilePaths,
  destinationFilePath = "./storyblok-component-types.d.ts",
  typeNamesPrefix,
  typeNamesSuffix = "_storyblok",
  customFieldTypesParserPath,
  JSONSchemaToTSCustomOptions,
}) => {
  const getJSONSchemasFromFiles = (paths: string[]) => {
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

  // Merge custom provided options to our defaults
  const JSONSchemaToTSOptions: JSONSchemaToTSOptions = {
    bannerComment: "",
    ...JSONSchemaToTSCustomOptions,
  };

  const componentsJSONSchemaArray = getJSONSchemasFromFiles(sourceFilePaths)?.flatMap(
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

    await generator.generateTSFile();
    generator.writeTypeDefs();
  }
};

export default generateTypescriptTypedefs;
