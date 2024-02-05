import { TYPES } from "./genericTypes";
import { getStoryTypeTitle } from "./getBlokTypeName";
import type { BlokSchemaPropertyTypeAnnotation, ISbBlokSchemaProperty } from "../../types";

/**
 * Get the correct JSONSchema type annotation for the provided Blok schema property object
 * @param schemaProperty A Storyblok Blok `schema` property object, A.K.A. what you can find in a key of the `schema` property inside a components JSONSchema.
 * @param GenerateTypescriptTypedefsCLIOptions An instance of
 * @returns A BlokSchemaPropertyTypeAnnotation object
 */
export const parseBlokSchemaProperty = (
  schemaProperty: ISbBlokSchemaProperty,
  GenerateTypescriptTypedefsCLIOptions: any
): BlokSchemaPropertyTypeAnnotation => {
  if (TYPES.includes(schemaProperty.type)) {
    return {
      type: schemaProperty.type,
    };
  }

  let type: string | string[] = "any";

  const options =
    schemaProperty.options && schemaProperty.options.length > 0 ? schemaProperty.options.map((item) => item.value) : [];

  // Add empty option to options array
  if (options.length > 0 && schemaProperty.exclude_empty_option !== true) {
    options.unshift("");
  }

  if (schemaProperty.source === "internal_stories") {
    if (schemaProperty.filter_content_type) {
      return {
        tsType: `(${schemaProperty.filter_content_type
          .map((type2) => getStoryTypeTitle(type2, GenerateTypescriptTypedefsCLIOptions))
          // In this case schemaProperty.type can be `option` or `options`. In case of `options` the type should be an array
          .join(" | ")} | string )${schemaProperty.type === "options" ? "[]" : ""}`,
      };
    }
  }

  if (
    // If there is no `source` and there are options, the source is itself
    // TODO: check if this is an old behaviour (shouldn't this be handled as an "internal" source?)
    (options.length > 0 && !schemaProperty.source) ||
    schemaProperty.source === "internal_languages" ||
    schemaProperty.source === "external"
  ) {
    type = "string";
  }

  if (schemaProperty.source === "internal") {
    type = ["number", "string"];
  }

  if (schemaProperty.type === "option") {
    if (options.length > 0) {
      return {
        type,
        enum: options,
      };
    }

    return {
      type,
    };
  }

  if (schemaProperty.type === "options") {
    if (options.length > 0) {
      return {
        type: "array",
        items: {
          enum: options,
        },
      };
    }

    return {
      type: "array",
      items: { type },
    };
  }

  switch (schemaProperty.type) {
    case "bloks":
      return { type: "array" };
    case "boolean":
      return { type: "boolean" };
    case "datetime":
    case "image":
    case "markdown":
    case "number":
    case "text":
    case "textarea":
      return { type: "string" };
    default:
      return { type: "any" };
  }
};
