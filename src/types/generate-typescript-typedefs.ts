import type { Options } from "json-schema-to-typescript";
export type {
  ISbConfig, // previously StoryblokConfig
  ISbCache, // previously StoryblokCache
  ISbResult, // previously StoryblokResult
  ISbResponse,
  ISbError,
  ISbNode,
  ISbSchema,
  ThrottleFn,
  AsyncFn,
  ArrayFn,
  ISbContentMangmntAPI,
  ISbManagmentApiResult, // previously StoryblokManagmentApiResult
  ISbStories, // previously Stories
  ISbStory, // previously Story
  ISbDimensions,
  ISbStoryData, // previously StoryData
  ISbAlternateObject, // previously AlternateObject
  ISbStoriesParams, // previously StoriesParams
  ISbStoryParams, // previously StoryParams
  ISbRichtext, // previously Richtext
} from "storyblok-js-client";

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
  component_whitelist?: string[];
  email_link_type?: boolean;
  exclude_empty_option?: boolean;
  filter_content_type?: string[];
  key: string;
  options?: ComponentPropertySchemaOption[];
  pos: number;
  restrict_components?: boolean;
  restrict_type?: "groups" | "";
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
