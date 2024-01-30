import { TYPES } from "./genericTypes";
import { getStoryTypeTitle } from "./getTitle";
import type { BlokSchemaObjectTypeAnnotation, ISbBlokSchemaObject } from "./typings";

/**
 * Get the correct JSONSchema type annotation for the provided Blok schema object
 * @param schemaObject A Storyblok Blok `schema` object, AKA what you can find in the `schema` key in a Blok JSONSchema
 * @param CLIOptions An instance of
 * @returns A BlokSchemaObjectTypeAnnotation object
 */
export const parseBlokSchemaObject = (
  schemaObject: ISbBlokSchemaObject,
  CLIOptions: any
): BlokSchemaObjectTypeAnnotation => {
  if (TYPES.includes(schemaObject.type)) {
    return {
      type: schemaObject.type,
    };
  }

  let type: string | string[] = "any";

  const options =
    schemaObject.options && schemaObject.options.length > 0 ? schemaObject.options.map((item) => item.value) : [];

  // Add empty option to options array
  if (options.length > 0 && schemaObject.exclude_empty_option !== true) {
    options.unshift("");
  }

  if (schemaObject.source === "internal_stories") {
    if (schemaObject.filter_content_type) {
      return {
        tsType: `(${schemaObject.filter_content_type
          .map((type2) => getStoryTypeTitle(type2, CLIOptions))
          // In this case schemaObject.type can be `option` or `options`. In case of `options` the type should be an array
          .join(" | ")} | string )${schemaObject.type === "options" ? "[]" : ""}`,
      };
    }
  }

  if (
    // If there is no `source` and there are options, the source is itself
    // TODO: check if this is an old behaviour (shouldn't this be handled as an "internal" source?)
    (options.length > 0 && !schemaObject.source) ||
    schemaObject.source === "internal_languages" ||
    schemaObject.source === "external"
  ) {
    type = "string";
  }

  if (schemaObject.source === "internal") {
    type = ["number", "string"];
  }

  if (schemaObject.type === "option") {
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

  if (schemaObject.type === "options") {
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

  switch (schemaObject.type) {
    case "text":
      return { type: "string" };
    case "bloks":
      return { type: "array" };
    case "number":
      return { type: "string" };
    case "image":
      return { type: "string" };
    case "boolean":
      return { type: "boolean" };
    case "textarea":
      return { type: "string" };
    case "markdown":
      return { type: "string" };
    case "datetime":
      return { type: "string" };
    default:
      return { type: "any" };
  }
};
