import chalk from "chalk";
import fs from "fs";
import { generateTSTypedefsFromComponentsJSONSchemas } from "../utils/typescript/convertJSONSchemaToTS";
import { GenerateTypescriptTypedefsCLIOptions, JSONSchemaToTSOptions } from "../types";
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

  const foo =
    componentsJSONSchemaArray &&
    (await GenerateTypesFromJSONSchemas.init(componentsJSONSchemaArray, {
      sourceFilePaths,
      destinationFilePath,
      typeNamesPrefix,
      typeNamesSuffix,
      customFieldTypesParserPath,
      JSONSchemaToTSCustomOptions: JSONSchemaToTSOptions,
    }));

  (await foo?.generateTSFile())?.writeTypeDefs();

  // componentsJSONSchemaArray &&
  //   generateTSTypedefsFromComponentsJSONSchemas(componentsJSONSchemaArray, {
  //     sourceFilePaths,
  //     destinationFilePath,
  //     typeNamesPrefix,
  //     typeNamesSuffix,
  //     customFieldTypesParserPath,
  //     JSONSchemaToTSCustomOptions: JSONSchemaToTSOptions,
  //   });
};

export default generateTypescriptTypedefs;
