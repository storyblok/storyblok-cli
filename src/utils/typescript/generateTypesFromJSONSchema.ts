import { JSONSchema } from "json-schema-to-typescript";
import { JSONSchemaToTSOptions } from "../../types";

type GenerateTSTypedefsFromComponentsJSONSchemasOptions = {
  sourceFilePaths: string[];
  destinationFilePath: string;
  typeNamesPrefix?: string;
  typeNamesSuffix?: string;
  customFieldTypesParserPath?: string;
  JSONSchemaToTSCustomOptions: JSONSchemaToTSOptions;
};

class GenerateTypesFromJSONSchemas {
  options: GenerateTSTypedefsFromComponentsJSONSchemasOptions;
  JSONSchemas: JSONSchema[];

  #customTypeParser: Function | null;

  private constructor(
    componentsJSONSchemas: JSONSchema[],
    options: GenerateTSTypedefsFromComponentsJSONSchemasOptions,
    customTypeParser: Function | null
  ) {
    this.options = options;
    this.JSONSchemas = componentsJSONSchemas;
    this.#customTypeParser = customTypeParser;
  }

  async init(componentsJSONSchemas: JSONSchema[], options: GenerateTSTypedefsFromComponentsJSONSchemasOptions) {
    const customTypeParser = await this.loadCustomFieldTypeParser(options.customFieldTypesParserPath);

    return new GenerateTypesFromJSONSchemas(componentsJSONSchemas, options, customTypeParser);
  }

  async loadCustomFieldTypeParser(path?: string): Promise<Function | null> {
    if (path) {
      try {
        const customTypeParser = await import(path);
        return customTypeParser;
      } catch (e) {
        // TODO: log error
        return null;
      }
    }

    return null;
  }
}
