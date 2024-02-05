import { Options, type JSONSchema } from "json-schema-to-typescript";
export type {
  // SbPluginFactory,
  // SbBlokKeyDataTypes,
  // SbBlokData,
  // SbRichTextOptions,
  // SbSDKOptions,
  // StoryblokClient,
  // StoryblokBridgeV2,
  // StoryblokBridgeConfigV2,
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
  // StoryblokComponentType,
  ISbStoryData, // previously StoryData
  ISbAlternateObject, // previously AlternateObject
  ISbStoriesParams, // previously StoriesParams
  ISbStoryParams, // previously StoryParams
  ISbRichtext, // previously Richtext
  // ISbEventPayload,
} from "storyblok-js-client";

export type ISbBlokSchemaPropertyType =
  | "text"
  | "bloks"
  | "array"
  | "option"
  | "options"
  | "number"
  | "image"
  | "boolean"
  | "textarea"
  | "markdown"
  | "richtext"
  | "datetime"
  | "asset"
  | "multiasset"
  | "multilink"
  | "table";

export type BasicType = "asset" | "multiasset" | "multilink" | "table" | "richtext";

export type CompilerOptions = Partial<Options>;

export interface StoryblokTsOptions {
  componentsJson: {
    components: JSONSchema[];
  };
  customTypeParser?: (key: string, options: JSONSchema) => void;
  compilerOptions?: CompilerOptions;
  path?: string;
  titleSuffix?: string;
  titlePrefix?: string;
}

export interface CliOptions {
  source: string;
  target?: string;
  titleSuffix?: string;
  titlePrefix?: string;
  customTypeParser?: string;
  compilerOptions?: CompilerOptions;
}

export interface ISbBlokSchemaPropertyOption {
  _uid: string;
  name: string;
  value: string;
}

export type ISbBlokSchemaProperty = {
  type: ISbBlokSchemaPropertyType;
  pos: number;
  key: string;
  use_uuid?: boolean;
  source?: "internal" | "external" | "internal_stories" | "internal_languages";
  options?: ISbBlokSchemaPropertyOption[];
  filter_content_type?: string[];
  restrict_components?: boolean;
  component_whitelist?: string[];
  component_group_whitelist?: string[];
  restrict_type?: "groups" | "";
  exclude_empty_option?: boolean;
};

export type BlokSchemaPropertyTypeAnnotation =
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
