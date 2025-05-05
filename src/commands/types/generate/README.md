# Type Generation Command

The Storyblok type generation command allows you to generate TypeScript type definitions for your Storyblok components. This is particularly useful for ensuring type safety when working with Storyblok content in your frontend applications.

## Prerequisites

Before generating types, ensure you have:

- Access to the target Storyblok space
- Access to the target Storyblok space and proper permissions
- TypeScript installed in your project (if you plan to use the generated types)
- Pull components from the target space using the `storyblok components pull` command

## Basic Usage

```bash
# Generate types for all components in a space
storyblok types generate --space 12345

# Generate types with strict mode
storyblok types generate --space 12345 --strict

# Generate types with a custom prefix for component names
storyblok types generate --space 12345 --type-prefix "Custom"

# Generate types with a custom suffix for component names (if you used the same flag when pulling components)
storyblok types generate --space 12345 --suffix "Component"

# Generate types in separate files (if you used the same flag when pulling components)
storyblok types generate --space 12345 --separate-files

# Generate types with a custom fields parser
storyblok types generate --space 12345 --custom-fields-parser ./path/to/parser.ts

# Generate types with custom compiler options
storyblok types generate --space 12345 --compiler-options ./path/to/options.json
```

## Architecture & Flow

The type generation command is organized in three main layers with a specific processing flow to ensure accurate type generation.

### Command Structure

```typescript
// 1. Command Layer (index.ts)
typesCommand
  .command('generate')
  .option('--sf, --separate-files', 'Generate types in separate files')
  .option('--strict', 'Use strict mode for type generation')
  .option('--type-prefix <prefix>', 'Prefix to be prepended to all generated component type names')
  .option('--suffix <suffix>', 'Components suffix')
  .option('--custom-fields-parser <path>', 'Path to the parser file for Custom Field Types')
  .option('--compiler-options <options>', 'Path to the compiler options from json-schema-to-typescript')
  .action(async (options) => {
    // Command implementation
  });

// 2. Operations Layer (actions.ts)
-generateTypes()
- generateStoryblokTypes()
- saveTypesToFile()

// 3. Actions Layer (actions.ts)
- getComponentType()
- getComponentPropertiesTypeAnnotations()
- sanitizeComponentName();
```

### Processing Flow Examples

#### 1. Basic Type Generation

```bash
storyblok types generate --space 12345
```

Flow:

**Read Phase**
```typescript
// 1. Read components from space
const spaceData = await readComponentsFiles({
  from: '12345',
  path: undefined
});

// 2. Generate Storyblok types
await generateStoryblokTypes({
  filename: undefined,
  path: undefined
});
```

**Generation Phase**
```typescript
// 3. Generate component types
const typedefString = await generateTypes(spaceData, {
  // Default options
});
```

**Save Phase**
```typescript
// 4. Save types to file
await saveTypesToFile('12345', typedefString, {
  // Default options
});
```

#### 2. Strict Mode Type Generation

```bash
storyblok types generate --space 12345 --strict
```

Flow:

**Generation Phase**
```typescript
// 1. Generate component types with strict mode
const typedefString = await generateTypes(spaceData, {
  strict: true
});
```

**Type Annotation Example**
```typescript
// Without strict mode (loose types)
export interface Component {
  text?: string;
  image?: {
    filename: string;
    alt: string;
  };
  [k: string]: unknown; // Index signature for additional properties
}

// With strict mode
export interface Component {
  text?: string;
  image?: {
    filename: string;
    alt: string;
  };
  // No index signature, only explicitly defined properties are allowed
}
```

#### 3. Custom Type Prefix

```bash
storyblok types generate --space 12345 --type-prefix "Custom"
```

Flow:

**Component Type Generation**
```typescript
// 1. Get component type with prefix
const componentType = getComponentType(component.name, {
  typePrefix: 'Custom'
});

// 2. Result: "CustomComponentName" instead of "ComponentName"
```

#### 4. Separate Files Generation

```bash
storyblok types generate --space 12345 --separate-files
```

Flow:

**File Generation**
```typescript
// 1. Generate types for each component
for (const component of spaceData.components) {
  const componentType = getComponentType(component.name, options);
  const properties = getComponentPropertiesTypeAnnotations(component.schema, options);

  // 2. Create a separate file for each component
  const fileContent = `export interface ${componentType} {
  ${properties}
}`;

  // 3. Save to a separate file
  await saveToFile(`${component.name}.d.ts`, fileContent);
}
```

#### 5. Custom Fields Parser

```bash
storyblok types generate --space 12345 --custom-fields-parser ./path/to/parser.ts
```

Flow:

**Parser Loading**
```typescript
// 1. Load custom fields parser
const customFieldsParser = await import('./path/to/parser.ts');

// 2. Use parser for custom field types
const propertyType = customFieldsParser(property);
```

## Key Features

### Type Safety

- Generate TypeScript interfaces for all Storyblok components
- Ensure type safety when working with Storyblok content
- Reduce runtime errors by catching type issues at compile time

### Customization Options

- Add prefixes to component type names
- Add suffixes to component type names
- Generate types in separate files
- Use strict mode for more precise types
- Customize compiler options

### Custom Field Support

- Parse custom field types with a custom parser
- Extend type generation for non-standard field types
- Support for complex field structures

### Storyblok Type Definitions

- Generate type definitions for Storyblok's built-in field types
- Include type definitions for Storyblok's API responses
- Ensure complete type coverage for Storyblok integration

## Type Generation File Structure

Generated type files follow this structure:

```typescript
// For a component named "hero" with text and image fields
export interface Hero {
  text: string;
  image: {
    filename: string;
    alt: string;
  };
}

// For a component with nested bloks
export interface Page {
  title: string;
  sections: Array<{
    component: string;
    _uid: string;
    text?: string;
    image?: {
      filename: string;
      alt: string;
    };
  }>;
}
```

## Testing Strategy

The command includes comprehensive test coverage:

### Unit Tests

- Component type generation
- Property type annotation generation
- Custom field parsing
- File saving functionality

### Testing Checklist

#### Running Type Generation

**General**
- [ ] It should show the command title
- [ ] It should throw an error if the user is not logged in: "You are currently not logged in. Please login first to get your user info."

**Required Arguments**
- `--space=TARGET_SPACE_ID`
  - [ ] It should read components from the target space
  - [ ] It should generate types for all components
  - [ ] It should save the generated types to a file

**Options**
- `--strict`
  - [ ] It should generate strict types without the [k: string]: unknown index signature
  - [ ] It should only allow explicitly defined properties

- `--type-prefix=<prefix>`
  - [ ] It should prepend the prefix to all component type names
  - [ ] It should handle special characters in the prefix

- `--suffix=<suffix>`
  - [ ] It should append the suffix to all component type names
  - [ ] It should handle special characters in the suffix

- `--separate-files`
  - [ ] It should generate a separate file for each component
  - [ ] It should name files according to component names

- `--custom-fields-parser=<path>`
  - [ ] It should load the custom fields parser from the specified path
  - [ ] It should use the parser for custom field types

- `--compiler-options=<options>`
  - [ ] It should load compiler options from the specified path
  - [ ] It should apply the options to the type generation

**Error Handling**
- [ ] It should throw an error if the space is not provided: "Please provide the space as argument --space YOUR_SPACE_ID."
- [ ] It should handle errors during type generation gracefully
- [ ] It should provide meaningful error messages for common issues
