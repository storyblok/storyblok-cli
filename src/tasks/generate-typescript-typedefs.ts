import chalk from "chalk";
import fs from "fs";
import { generateTSTypedefsFromComponentsJSONSchema } from "../utils/typescript/convert-sb-json-schema-to-ts";

type GenerateTSTypedefsOptions = {
  sourceFilePaths: string;
  destinationFilePath?: string;
  titlePrefix?: string;
  titleSuffix?: string;
  customTypeParser?: string;
};
type GenerateTSTypedefs = (options: GenerateTSTypedefsOptions) => void;

const generateTypescriptTypedefs: GenerateTSTypedefs = ({
  sourceFilePaths,
  destinationFilePath = "./storyblok-component-types.d.ts",
  titlePrefix,
  titleSuffix = "_storyblok",
  customTypeParser,
}) => {
  const getDataFromJSON = (path: string) => {
    const sourceFilePathsArray = path.split(",");
    try {
      const foo = sourceFilePathsArray.map((sourceFilePath) => JSON.parse(fs.readFileSync(sourceFilePath, "utf8")));
      return foo;
    } catch (e) {
      console.error(
        `${chalk.red("X")} 
        Could not load any JSON file from these paths ${sourceFilePathsArray}`
      );
      return null;
    }
  };
  const componentsJSONSchemaArray = getDataFromJSON(sourceFilePaths)?.flatMap(
    (componentsJSONSchema) => componentsJSONSchema.components || componentsJSONSchema
  );

  componentsJSONSchemaArray &&
    generateTSTypedefsFromComponentsJSONSchema(componentsJSONSchemaArray, {
      sourceFilePaths,
      destinationFilePath,
      titlePrefix,
      titleSuffix,
      customTypeParser,
    });
};

export default generateTypescriptTypedefs;
