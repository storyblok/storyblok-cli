import type { JSONSchema, Options } from "json-schema-to-typescript";
export type { ISbStoryData } from "storyblok-js-client";

export type StoryblokProvidedPropertyType = "asset" | "multiasset" | "multilink" | "table" | "richtext";

export type ComponentPropertySchemaType =
  | StoryblokProvidedPropertyType
  | "array"
  | "bloks"
  | "boolean"
  | "custom"
  | "datetime"
  | "image"
  | "markdown"
  | "number"
  | "option"
  | "options"
  | "text"
  | "textarea";

export type JSONSchemaToTSOptions = Partial<Options>;

export interface GenerateTypescriptTypedefsCLIOptions {
  sourceFilePaths: string[];
  destinationFilePath?: string;
  typeNamesPrefix?: string;
  typeNamesSuffix?: string;
  customFieldTypesParserPath?: string;
  JSONSchemaToTSOptionsPath?: string;
}

export interface ComponentPropertySchemaOption {
  _uid: string;
  name: string;
  value: string;
}

export type ComponentPropertySchema = {
  asset_link_type?: boolean;
  component_group_whitelist?: string[];
  component_tag_whitelist?: number[];
  component_whitelist?: string[];
  email_link_type?: boolean;
  exclude_empty_option?: boolean;
  filter_content_type?: string | string[];
  key: string;
  options?: ComponentPropertySchemaOption[];
  pos: number;
  restrict_components?: boolean;
  restrict_type?: "groups" | "tags" | "";
  source?: "internal" | "external" | "internal_stories" | "internal_languages";
  type: ComponentPropertySchemaType;
  use_uuid?: boolean;
};

export type ComponentPropertyTypeAnnotation =
  | {
      tsType: string | string[];
    }
  | {
      type: string | string[];
      enum: string[];
    }
  | {
      type: string | string[];
    }
  | {
      type: "array";
      items: {
        type: string | string[];
      };
    }
  | {
      type: "array";
      items: {
        enum: string[];
      };
    };

export type GenerateTSTypedefsFromComponentsJSONSchemasOptions = {
  sourceFilePaths: string[];
  destinationFilePath: string;
  typeNamesPrefix?: string;
  typeNamesSuffix?: string;
  customFieldTypesParserPath?: string;
  JSONSchemaToTSCustomOptions: JSONSchemaToTSOptions;
};

export type CustomTypeParser = (_typeName: string, _schema: ComponentPropertySchema) => Record<string, any>;

export type GetStoryblokProvidedPropertyTypeSchemaFn = (title: string) => JSONSchema;

export type ComponentGroupsAndNamesObject = {
  componentGroups: Map<string, Set<string>>;
  componentNames: Set<string>;
};
