import fs from "fs";
import lodash from "lodash";
import { compile, type JSONSchema } from "json-schema-to-typescript";
import type {
  ComponentPropertyTypeAnnotation,
  ComponentPropertySchema,
  StoryblokProvidedPropertyType,
  CustomTypeParser,
  GenerateTSTypedefsFromComponentsJSONSchemasOptions,
  GetStoryblokProvidedPropertyTypeSchemaFn,
  ComponentGroupsAndNamesObject,
} from "../../types";
import {
  getAssetJSONSchema,
  getMultiassetJSONSchema,
  getMultilinkJSONSchema,
  getRichtextJSONSchema,
  getTableJSONSchema,
} from "./storyblokProvidedPropertyTypes";
import { resolve } from "path";

const { camelCase, startCase } = lodash;

/**
 * This class handles the generation of Typescript type definitions based on Storyblok components JSON Schemas.
 * To initialize this class, call the async static method `init`.
 *
 *
 * DISAMBIGUATION GLOSSARY
 *
 * `Component`
 * The JSON representation of a component as provided by the Storyblok JSON schema.
 * It should be called `blok`, but the JSON schema itself and all the CLI commands refer to those entities as `components`
 *
 * `JSONSchema` - also `schema`
 * A JSONSchema representation of a `component` or a part of it. It may represent entire components, their properties, etc.
 *
 * `Type` - also `TypeString`
 * The name of a Typescript type - as in `type StoryblokExampleType`
 *
 * `Typedef` - also `TypedefString`
 * The actual type definition of a Typescript type, listing all the properties/methods of a type.
 *
 * `Type annotation`
 * A JSON representation of a Typescript Type that is going to be compiled into an actual Type string by json-schema-to-ts
 *
 * `Storyblok-provided property types`
 * It describes those field types provided out of the box from Storyblok itself which have a predefined JSON Schema that is going to be rendered every time a property of that type is used in any component
 */

export class GenerateTypesFromJSONSchemas {
  #STORY_TYPE = "ISbStoryData";

  #options: GenerateTSTypedefsFromComponentsJSONSchemasOptions;
  #componentsJSONSchemas: JSONSchema[];
  #customTypeParser: CustomTypeParser | null;
  #typedefsFileStrings: string[] = [
    "// This file was generated by the storyblok CLI.",
    "// DO NOT MODIFY THIS FILE BY HAND.",
    `import type { ${this.#STORY_TYPE} } from "storyblok";`,
  ];
  #componentGroups: Map<string, Set<string>>;
  #componentNames: Set<string>;

  #getSchemaForStoryblokProvidedPropertyType = new Map<
    StoryblokProvidedPropertyType,
    GetStoryblokProvidedPropertyTypeSchemaFn
  >([
    ["asset", getAssetJSONSchema],
    ["multiasset", getMultiassetJSONSchema],
    ["multilink", getMultilinkJSONSchema],
    ["richtext", getRichtextJSONSchema],
    ["table", getTableJSONSchema],
  ]);

  #hasStoryblokProvidedPropertyTypeBeenGenerated = new Map<StoryblokProvidedPropertyType, boolean>([
    ["asset", false],
    ["multiasset", false],
    ["multilink", false],
    ["richtext", false],
    ["table", false],
  ]);

  private constructor(
    componentsJSONSchemas: JSONSchema[],
    options: GenerateTSTypedefsFromComponentsJSONSchemasOptions,
    customTypeParser: CustomTypeParser | null
  ) {
    this.#options = options;
    this.#componentsJSONSchemas = componentsJSONSchemas;
    this.#customTypeParser = customTypeParser;
    const { componentGroups, componentNames } =
      this.#generateComponentGroupsAndComponentNamesFromJSONSchemas(componentsJSONSchemas);
    this.#componentGroups = componentGroups;
    this.#componentNames = componentNames;
  }

  /**
   * This method act as a proxy to have an async constructor. It initializes the class instance and loads a parser for custom field types
   * @param componentsJSONSchemas An array of Storyblok components schemas
   * @param options A set of options for the command
   * @returns An instance of the GenerateTypesFromJSONSchemas class
   */
  static async init(componentsJSONSchemas: JSONSchema[], options: GenerateTSTypedefsFromComponentsJSONSchemasOptions) {
    const customTypeParser = await this.#loadCustomFieldTypeParser(options.customFieldTypesParserPath);

    return new GenerateTypesFromJSONSchemas(componentsJSONSchemas, options, customTypeParser);
  }

  /**
   * Loads a parser for custom field types.
   * A `parser` in this case means a function that is the default export of a JS module (can be both CommonJS or ESM) that given a JSONSchema custom property returns a predefined JSONSchema for that property, so that it can be later converted into the appropriate Typedef
   * @param path Path to the file that exports the parser function
   * @returns The parser function or null
   */
  static async #loadCustomFieldTypeParser(path?: string): Promise<CustomTypeParser | null> {
    if (path) {
      try {
        const customTypeParser = await import(resolve(path));
        return customTypeParser.default;
      } catch (e) {
        console.error(e);
        return null;
      }
    }

    return null;
  }

  /**
   * Extract all component names and all the groups containing the respective components from an array of component JSONSchemas.
   * @param componentsJSONSchemas Array of Storyblok component schemas
   * @returns An object with two properties, `componentGroups` that holds the relationship between groups and child components and `componentNames` which is a list of all the component names, including the ones that do not belong to any group.
   */
  #generateComponentGroupsAndComponentNamesFromJSONSchemas(componentsJSONSchemas: JSONSchema[]) {
    const { componentGroups, componentNames } = componentsJSONSchemas.reduce<ComponentGroupsAndNamesObject>(
      (acc, currentComponent) => {
        if (currentComponent.component_group_uuid)
          acc.componentGroups.set(
            currentComponent.component_group_uuid,
            acc.componentGroups.has(currentComponent.component_group_uuid)
              ? acc.componentGroups.get(currentComponent.component_group_uuid)!.add(currentComponent.name)
              : new Set([currentComponent.name])
          );

        acc.componentNames.add(currentComponent.name);
        return acc;
      },
      { componentGroups: new Map(), componentNames: new Set() }
    );

    return { componentGroups, componentNames };
  }

  /**
   * Triggers the whole TS Type definition process
   * @returns The class instance
   */
  async generateTSFile() {
    for await (const component of this.#componentsJSONSchemas) {
      // By default all types will havea a required `_uid` and a required `component` properties
      const requiredFields = Object.entries<Record<string, any>>(component.schema).reduce(
        (acc, [key, value]) => {
          if (value.required) {
            return [...acc, key];
          }
          return acc;
        },
        ["component", "_uid"]
      );

      const componentType = this.#getComponentType(component.name);
      const componentPropertiesTypeAnnotations = await this.#getTypeAnnotationsForComponentProperties(component.schema);

      const componentSchema: JSONSchema = {
        $id: `#/${component.name}`,
        title: componentType,
        type: "object",
        required: requiredFields,
        properties: {
          ...componentPropertiesTypeAnnotations,
          component: {
            type: "string",
            enum: [component.name],
          },
          _uid: {
            type: "string",
          },
        },
      };

      try {
        const typedefString = await compile(componentSchema, component.name, this.#options.JSONSchemaToTSCustomOptions);
        this.#typedefsFileStrings.push(typedefString);
      } catch (e) {
        // TODO: add proper error handling
        console.error("ERROR", e);
      }
    }

    return this.#writeTypeDefs();
  }

  /**
   * Creates and returns an Object representing the Typescript type definitions for the provided component and its properties
   * @param componentSchema A JSONSchema representing a single component
   * @returns Returns a JSONSchema-like object with the type annotation for each property
   * @example
   * // Example of a returned JSON
   * {
   *  image: { type: 'string' },
   *  given_name: { type: 'string' },
   *  family_name: { type: 'string' },
   *  about: { type: 'string' },
   *  email: { type: 'string' },
   *  cta: { type: 'array', tsType: '(FooCTAStoryblok)[]' },
   * }
   */
  async #getTypeAnnotationsForComponentProperties(componentSchema: JSONSchema) {
    const typeAnnotations: JSONSchema["properties"] = {};

    for await (const [propertyName, propertyValue] of Object.entries<ComponentPropertySchema>(componentSchema)) {
      // Schema keys that start with `tab-` are only used for describing tabs in the Storyblok UI.
      // Therefore they are ignored.
      if (propertyName.startsWith("tab-")) {
        continue;
      }

      const propertyType = propertyValue.type;
      const propertyTypeAnnotation: JSONSchema = {
        [propertyName]: this.#getPropertyTypeAnnotation(propertyValue),
      };

      // Generate type for custom field
      if (propertyType === "custom") {
        Object.assign(
          typeAnnotations,
          typeof this.#customTypeParser === "function" ? this.#customTypeParser(propertyName, propertyValue) : {}
        );

        continue;
      }

      // Generate type for field types provided by Storyblok
      if ((this.#storyblokProvidedPropertyTypes as string[]).includes(propertyType)) {
        const componentType = this.#getComponentType(propertyType);
        propertyTypeAnnotation[propertyName].tsType = componentType;

        const typedefForStoryblokProvidedType = await this.#generateTypedef(
          propertyType as StoryblokProvidedPropertyType,
          componentType
        );

        // Include Storyblok field type type definition to the typedef string file, if it hasn't been included yet
        if (typedefForStoryblokProvidedType) {
          this.#typedefsFileStrings.push(typedefForStoryblokProvidedType);
        }
      }

      if (propertyType === "multilink") {
        const excludedLinktypes: string[] = [
          ...(!propertyValue.email_link_type ? ['{ linktype?: "email" }'] : []),
          ...(!propertyValue.asset_link_type ? ['{ linktype?: "asset" }'] : []),
        ];
        const componentType = this.#getComponentType(propertyType);

        propertyTypeAnnotation[propertyName].tsType =
          excludedLinktypes.length > 0 ? `Exclude<${componentType}, ${excludedLinktypes.join(" | ")}>` : componentType;
      }

      if (propertyType === "bloks") {
        if (propertyValue.restrict_components) {
          // Components restricted by groups
          if (propertyValue.restrict_type === "groups") {
            if (
              Array.isArray(propertyValue.component_group_whitelist) &&
              propertyValue.component_group_whitelist.length > 0
            ) {
              const componentsInGroupWhitelist = propertyValue.component_group_whitelist.reduce(
                (components: string[], groupUUID: string) => {
                  const componentsInGroup = this.#componentGroups.get(groupUUID);

                  return componentsInGroup
                    ? [
                        ...components,
                        ...Array.from(componentsInGroup).map((componentName) => this.#getComponentType(componentName)),
                      ]
                    : components;
                },
                []
              );

              propertyTypeAnnotation[propertyName].tsType =
                componentsInGroupWhitelist.length > 0 ? `(${componentsInGroupWhitelist.join(" | ")})[]` : `never[]`;
            }
          } else {
            // Components restricted by 1-by-1 list
            if (Array.isArray(propertyValue.component_whitelist) && propertyValue.component_whitelist.length > 0) {
              propertyTypeAnnotation[propertyName].tsType = `(${propertyValue.component_whitelist
                .map((name: string) => this.#getComponentType(name))
                .join(" | ")})[]`;
            }
          }
        } else {
          // All components can be slotted in this property (AKA no restrictions)
          propertyTypeAnnotation[propertyName].tsType = `(${Array.from(this.#componentNames)
            .map((componentName) => this.#getComponentType(componentName))
            .join(" | ")})[]`;
        }
      }

      Object.assign(typeAnnotations, propertyTypeAnnotation);
    }

    return typeAnnotations;
  }

  /**
   * Get the correct JSONSchema type annotation for the provided property
   * @param property A Storyblok component property object, A.K.A. what you can find in a key of the `schema` property inside a component JSONSchema.
   * @returns A ComponentPropertyTypeAnnotation object
   */
  #getPropertyTypeAnnotation(property: ComponentPropertySchema): ComponentPropertyTypeAnnotation {
    // If a property type is one of the ones provided by Storyblok, return that type
    // Casting as string[] to avoid TS error on using Array.includes on different narrowed types
    if ((this.#storyblokProvidedPropertyTypes as string[]).includes(property.type)) {
      return {
        type: property.type,
      };
    }

    // Initialize property type as any (fallback type)
    let type: string | string[] = "any";

    // Initialize the array of options (possible values) of the property
    const options = property.options && property.options.length > 0 ? property.options.map((item) => item.value) : [];

    // Add empty option to options array
    if (options.length > 0 && property.exclude_empty_option !== true) {
      options.unshift("");
    }

    if (property.source === "internal_stories") {
      if (property.filter_content_type) {
        if (typeof property.filter_content_type === "string") {
          return {
            tsType: `(${this.#getStoryType(property.filter_content_type)} | string )${property.type === "options" ? "[]" : ""}`,
          };
        }

        return {
          tsType: `(${property.filter_content_type
            .map((type2) => this.#getStoryType(type2))
            // In this case property.type can be `option` or `options`. In case of `options` the type should be an array
            .join(" | ")} | string )${property.type === "options" ? "[]" : ""}`,
        };
      }
    }

    if (
      // If there is no `source` and there are options, the data source is the component itself
      // TODO: check if this is an old behaviour (shouldn't this be handled as an "internal" source?)
      (options.length > 0 && !property.source) ||
      property.source === "internal_languages" ||
      property.source === "external"
    ) {
      type = "string";
    }

    if (property.source === "internal") {
      type = ["number", "string"];
    }

    if (property.type === "option") {
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

    if (property.type === "options") {
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

    switch (property.type) {
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
  }

  /**
   * Generate the Type - only the name - from the supplied component name with the provided options
   * @param componentName The name of the component - in snake_case
   * @returns A string with the Type name in PascalCase, as for Typescript standards
   */
  #getComponentType(componentName: string) {
    const componentType = startCase(
      camelCase(`${this.#options.typeNamesPrefix ?? ""}_${componentName}_${this.#options.typeNamesSuffix}`)
    ).replace(/ /g, "");

    /**
     * A TS identifier cannot start with a number > add an underscore in that case
     * TODO: add some logic to handle other edge cases, such as JS/TS reserved keywords as blok names (i.e. if a blok is named `string`, the resulting type would be `String`, if no suffix is provided)
     */
    const isFirstCharacterNumber = !isNaN(parseInt(componentType.charAt(0)));
    return isFirstCharacterNumber ? `_${componentType}` : componentType;
  }

  /**
   * Get the Typescript Type of a content-type wrapped in the Type defined for the whole story object, which is stored in this.#STORY_TYPE
   * @param contentTypeName The name of the content-type
   * @returns The Typescript Type for the corresponding content-type
   */
  #getStoryType(contentTypeName: string) {
    return `${this.#STORY_TYPE}<${this.#getComponentType(contentTypeName)}>`;
  }

  /**
   * Generate one of the default types that are provided by Storyblok - such as Multilink, Asset, etc., if they have not been already generated
   * @param propertyType The type of the Storyblok-provided property
   * @param title The name of the property
   * @returns The type definition for the provided property
   */
  async #generateTypedef(propertyType: StoryblokProvidedPropertyType, title: string) {
    return (
      !this.#hasStoryblokProvidedPropertyTypeBeenGenerated.get(propertyType) &&
      (await this.#generateTypedefForStoryblokProvidedProperty(propertyType, title))
    );
  }

  /**
   *
   * @param propertyType The type of the Storyblok-provided property
   * @param title
   * @returns
   */
  async #generateTypedefForStoryblokProvidedProperty(propertyType: StoryblokProvidedPropertyType, title: string) {
    try {
      const schema = this.#getSchemaForStoryblokProvidedPropertyType.get(propertyType)?.(title);
      return schema && (await this.#generateTypeString(schema, propertyType));
    } catch (e) {
      console.error(`Error generating type ${propertyType} with title ${title}`, e);
    }
  }

  /**
   * Leverage json-schema-to-typescript to compile a component schema whose type is one of the default types provided by Storyblok into a Typescript Type string
   * @param schema The JSON Schema of a component
   * @param typeName One of the default property types provided by Storyblok
   * @returns A string containing the Typescript Type definition of the provided component
   */
  async #generateTypeString(schema: JSONSchema, typeName: StoryblokProvidedPropertyType) {
    // TODO: handle potential errors and log error messages
    const typeString = await compile(schema, typeName, this.#options.JSONSchemaToTSCustomOptions);
    this.#hasStoryblokProvidedPropertyTypeBeenGenerated.set(typeName, true);

    return typeString;
  }

  /**
   * Write the array of type definitions - one entry per type - to the file at the provided `destinationFilePath`
   * @returns The class instance
   */
  #writeTypeDefs() {
    if (this.#options.destinationFilePath) {
      fs.writeFileSync(this.#options.destinationFilePath, this.#typedefsFileStrings.join("\n"));
    }

    return this;
    // TODO: log error in case of missing path
  }

  /**
   * Get the list of Storyblok-provided property types
   */
  get #storyblokProvidedPropertyTypes() {
    return Array.from(this.#getSchemaForStoryblokProvidedPropertyType.keys());
  }
}
