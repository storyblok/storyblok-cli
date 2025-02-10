# Components Pull Command

The `storyblok components pull` command allows you to download your space's components schema, groups, presets, and internal tags as JSON files. This is useful for version control, backup purposes, or migrating components between spaces.

## Basic Usage

```bash
# Pull all components from a space
storyblok components pull --space 295017

# Pull a specific component
storyblok components pull my-component --space 295017
```

## Command Options

| Option | Alias | Description |
|--------|-------|-------------|
| `--space <spaceId>` | `-s` | (Required) The ID of the space to pull components from |
| `--filename <name>` | `-f` | Custom name for the consolidated file (default: "components") |
| `--separate-files` | `--sf` | Create individual files for each component |
| `--suffix <suffix>` | `--su` | Add a suffix to the file name (e.g., components.{suffix}.json) |
| `--path <path>` | `-p` | Custom path to store the files (default: ".storyblok/components/{spaceId}") |
| `--verbose` | `-v` | Show detailed logs and error messages |

## Output Structure

### Consolidated Files (Default)

When pulling without the `--separate-files` flag, the command will create a folder `.storyblok/components/{spaceId}` with the following files:

```markdown
.storyblok/
└── components/
    └── 295017/
        ├── components.json    # All components schemas
        ├── groups.json       # Component groups
        ├── presets.json     # Component presets
        └── tags.json        # Internal tags
```

### Separate Files
When using the `--separate-files` flag, each component will be saved in its own file:

```markdown
.storyblok/
└── components/
    └── 295017/
        ├── groups.json
        ├── tags.json
        ├── hero.json
        ├── hero.presets.json # Presets used by the hero component
        ├── page.json
        └── teaser.json
```

## Examples

### Pull all components with default settings

```bash
storyblok components pull --space 295017
```

Expected output:

```markdown
.storyblok/
└── components/
    └── 295017/
        ├── components.json    # All components schemas
        ├── groups.json       # Component groups
        ├── presets.json     # Component presets
        └── tags.json        # Internal tags
```

### Pull all components into separate files

```bash
storyblok components pull --space 295017 --separate-files
```

Expected output:

```markdown
.storyblok/
└── components/
    └── 295017/
        ├── component-groups.json
        ├── component-presets.json
        ├── component-tags.json
        ├── hero.json
        ├── page.json
        └── teaser.json      # One file per component
```

### Pull a specific component

```bash
storyblok components pull hero --space 295017
```

Expected output:

```
.storyblok/
└── components/
    └── 295017/
        ├── hero.json    # Only contains the hero component
        ├── hero.presets.json # Presets used by the hero component
        ├── groups.json       # All groups, even if not used by the hero component
        └── tags.json        # All tags, even if not used by the hero component
```

### Pull a specific component with separate files

```bash
storyblok components pull hero --space 295017 --separate-files
```

Expected output:

```markdown
.storyblok/
└── components/
    └── 295017/
        ├── hero.json    # Only contains the hero component
        ├── hero.presets.json # Presets used by the hero component
        ├── groups.json       # All groups, even if not used by the hero component
        └── tags.json        # All tags, even if not used by the hero component
```

### Pull with custom filename and suffix

```bash
storyblok components pull --space 295017 --filename my-components --suffix prod
```

Expected output:

```markdown
.storyblok/
└── components/
    └── 295017/
        ├── my-components.prod.json  # All components
        ├── groups.json
        ├── presets.json
        └── tags.json
```

### Pull with custom filename and suffix with separate files

```bash
storyblok components pull --space 295017 --filename my-components --suffix prod --separate-files
```

Expected output:

It will throw an warning: `The --filename option is ignored when using --separate-files` but it will create the files with the suffix.

```markdown
.storyblok/
└── components/
    └── 295017/
        ├── hero.prod.json
        ├── hero.presets.prod.json
        ├── groups.json
        └── tags.json
```

### Pull to a custom path

```bash
storyblok components pull --space 295017 --path ./backup
```

Expected output:

```markdown
backup/
└── components/
    └── 295017/
        ├── components.json
        ├── groups.json
        ├── presets.json
        └── tags.json
```

The `components/{spaceId}` folder structure is always maintained regardless of the custom path provided. This ensures consistency across different path configurations.

## Manual Testing Checklist

1. Basic Pull Operations
   - [ ] Pull all components from a space (consolidated files)
   - [ ] Pull a single component by name
   - [ ] Verify all related files are created (components.json, groups.json, presets.json, tags.json)
   - [ ] Check if file contents are valid JSON

2. Separate Files Mode
   - [ ] Pull all components with --separate-files flag
   - [ ] Verify individual component files are created with the correct naming pattern (component-name.json)
   - [ ] Check if component relationships are maintained
   - [ ] Verify support files (groups, presets, tags) are created

3. Custom Naming and Paths
   - [ ] Test custom filename with --filename flag
   - [ ] Test custom suffix with --suffix flag
   - [ ] Test custom path with --path flag
   - [ ] Verify file naming patterns are correct

4. Error Handling
   - [ ] Test pull without space ID
   - [ ] Test pull with invalid space ID
   - [ ] Test pull with non-existent component name
   - [ ] Verify error messages are clear and helpful

5. Special Cases
   - [ ] Pull components with nested groups
   - [ ] Pull components with multiple presets
   - [ ] Pull components with internal tags
   - [ ] Test verbose mode with --verbose flag
