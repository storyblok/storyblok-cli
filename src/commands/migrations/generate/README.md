# Migrations Generate Command

The `storyblok migrations generate` command allows you to generate migration files for specific components. This is useful when you need to transform or update field values across your Storyblok content.

## Basic Usage

```bash
# Generate a migration for a specific component
storyblok migrations generate my-component --space 295017

# Generate a migration with a custom path
storyblok migrations generate my-component --space 295017 --path ./custom-path

# Generate a migration with a custom suffix
storyblok migrations generate my-component --space 295017 --suffix staging
```

## Command Options

| Option | Alias | Description |
|--------|-------|-------------|
| `--space <spaceId>` | `-s` | (Required) The ID of the space to generate migrations for |
| `--path <path>` | `-p` | Custom path to store the migration files (default: ".storyblok/migrations/{spaceId}") |
| `--suffix <suffix>` | `--su` | Suffix to add to the file name (e.g. {component-name}.<suffix>.js) |
| `--verbose` | `-v` | Show detailed logs and error messages |

## Output Structure

The command will create a migration file in the following structure:

```markdown
.storyblok/
└── migrations/
    └── {spaceId}/
        └── {component-name}.js
```

If a suffix is provided, the file will be named:
```markdown
.storyblok/
└── migrations/
    └── {spaceId}/
        └── {component-name}.<suffix>.js
```

## Migration File Structure

Each generated migration file follows this structure:

```javascript
export default function (block) {
  // Example to change a string to boolean
  // block.fullname = !!(block.fullname)

  // Example to transfer content from other field
  // block.fullname = block.other_field
}
```

## Examples

### Generate a Basic Migration

```bash
storyblok migrations generate hero --space 295017
```

This will create:

```markdown
.storyblok/
└── migrations/
    └── 295017/
        └── hero.js
```

### Generate with Custom Path

```bash
storyblok migrations generate hero --space 295017 --path ./migrations
```

This will create:

```markdown
migrations/
└── 295017/
    └── hero.js
```

### Generate with Custom Suffix

```bash
storyblok migrations generate hero --space 295017 --suffix staging
```

This will create:

```markdown
.storyblok/
└── migrations/
    └── 295017/
        └── hero.staging.js
```

## Error Cases

The command will fail with helpful error messages in the following cases:

- No component name provided
- No space ID provided
- User not logged in
- Component not found in the space
- Invalid space ID

## Manual Testing Checklist

1. Basic Generation
   - [ ] Generate migration for a component
   - [ ] Verify file is created in the correct location
   - [ ] Check if generated file has correct structure
   - [ ] Verify component name is correctly set

2. Path Options
   - [ ] Test default path generation
   - [ ] Test custom path generation
   - [ ] Test custom suffix generation
   - [ ] Verify directory structure is maintained

3. Error Handling
   - [ ] Test without component name
   - [ ] Test without space ID
   - [ ] Test with non-existent component
   - [ ] Test while not logged in
   - [ ] Verify error messages are clear and helpful

4. Special Cases
   - [ ] Test with complex component names
   - [ ] Test verbose mode output
   - [ ] Test with various suffix values
   - [ ] Verify file permissions are correct

## Best Practices

1. **Naming Conventions**
   - Use clear, descriptive names for your migration files
   - Follow a consistent pattern for component names
   - Use meaningful suffixes (e.g., 'staging', 'prod', 'v1')

2. **Migration Logic**
   - Keep migrations atomic (one change per migration)
   - Always include validation in your migration logic
   - Test migrations on a staging space first

3. **Version Control**
   - Commit migration files to version control
   - Include clear documentation of what each migration does
   - Use suffixes to differentiate between environments

## Related Commands

- `storyblok migrations run` - Apply generated migrations to your content
