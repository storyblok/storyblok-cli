# Migrations Generate Command

The `storyblok migrations generate` command allows you to generate migration files for specific component fields. This is useful when you need to transform or update field values across your Storyblok content.

## Basic Usage

```bash
# Generate a migration for a specific component field
storyblok migrations generate my-component --field my-field --space 295017

# Generate a migration with a custom path
storyblok migrations generate my-component --field my-field --space 295017 --path ./custom-path
```

## Command Options

| Option | Alias | Description |
|--------|-------|-------------|
| `--space <spaceId>` | `-s` | (Required) The ID of the space to generate migrations for |
| `--field <fieldName>` | `--fi` | (Required) The name of the field to migrate |
| `--path <path>` | `-p` | Custom path to store the migration files (default: ".storyblok/migrations/{spaceId}") |
| `--verbose` | `-v` | Show detailed logs and error messages |

## Output Structure

The command will create a migration file in the following structure:

```markdown
.storyblok/
└── migrations/
    └── {spaceId}/
        └── {component-name}-{field-name}.js
```

## Migration File Structure

Each generated migration file follows this structure:

```javascript
module.exports = {
  // The name of the component to migrate
  component: 'component-name',
  // The field that will be migrated
  field: 'field-name',
  // The migration function that will be applied to the field
  migrate: (field) => {
    // Your migration logic here
    return field;
  }
};
```

## Examples

### Generate a Basic Migration

```bash
storyblok migrations generate hero --field title --space 295017
```

This will create:

```markdown
.storyblok/
└── migrations/
    └── 295017/
        └── hero-title.js
```

### Generate with Custom Path

```bash
storyblok migrations generate hero --field title --space 295017 --path ./migrations
```

This will create:

```markdown
migrations/
└── 295017/
    └── hero-title.js
```

## Error Cases

The command will fail with helpful error messages in the following cases:

- No component name provided
- No field name provided
- No space ID provided
- User not logged in
- Component not found in the space
- Invalid space ID

## Manual Testing Checklist

1. Basic Generation
   - [ ] Generate migration for a simple field
   - [ ] Verify file is created in the correct location
   - [ ] Check if generated file has correct structure
   - [ ] Verify component and field names are correctly set

2. Path Options
   - [ ] Test default path generation
   - [ ] Test custom path generation
   - [ ] Verify directory structure is maintained

3. Error Handling
   - [ ] Test without component name
   - [ ] Test without field name
   - [ ] Test without space ID
   - [ ] Test with non-existent component
   - [ ] Test while not logged in
   - [ ] Verify error messages are clear and helpful

4. Special Cases
   - [ ] Test with complex component names
   - [ ] Test with nested field paths
   - [ ] Test verbose mode output
   - [ ] Verify file permissions are correct

## Best Practices

1. **Naming Conventions**
   - Use clear, descriptive names for your migration files
   - Follow a consistent pattern for field names

2. **Migration Logic**
   - Keep migrations atomic (one change per migration)
   - Always include validation in your migration logic
   - Test migrations on a staging space first

3. **Version Control**
   - Commit migration files to version control
   - Include clear documentation of what each migration does

## Related Commands

- `storyblok migrations run` - Apply generated migrations to your content
