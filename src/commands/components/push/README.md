# Components Push Command

The `storyblok components push` command allows you to push component schemas, groups, presets, and internal tags to a target Storyblok space. This is particularly useful for migrating components between spaces or deploying component changes across environments.

## Prerequisites

Before pushing components, ensure you have the necessary files in your `.storyblok/components/{spaceId}` directory. These files can be obtained using the `storyblok components pull` command. The file structure should match how you intend to push:

- For consolidated files: You need the main JSON files (components.json, groups.json, presets.json, tags.json)
- For separate files: You need individual component files plus the support files (groups.json, tags.json)

## Basic Usage

```bash
# Push all components to a space
storyblok components push --space 295017

# Push a specific component
storyblok components push hero --space 295017
```

## Architecture & Flow

The push command is organized in three main layers with a specific processing flow to ensure dependencies and references are handled correctly.

### Command Structure

```typescript
// 1. Command Layer (index.ts)
componentsCommand
  .command('push [componentName]')
  // ... options

// 2. Operations Layer (operations.ts)
  - handleWhitelists()
  - handleTags()
  - handleComponentGroups()
  - handleComponents()

// 3. Actions Layer (actions.ts)
  - pushComponent()
  - updateComponent()
  - upsertComponent()
  - pushComponentGroup();
// ... etc
```

### Processing Flow Examples

#### 1. Simple Component Push
```bash
storyblok components push hero --space 295017
```

Flow:
1. **Read Phase**
   ```typescript
   // 1. Reads files from .storyblok/components/295017/
   let spaceData = await readComponentsFiles({
     from: '295017',
     path: undefined,
     separateFiles: false
   });

   // 2. Filters to only include 'hero' component and its dependencies
   spaceData = filterSpaceDataByComponent(spaceData, 'hero');
   ```

2. **Dependencies Phase**
   ```typescript
   // 3. Process whitelist dependencies first
   const whitelistResults = await handleWhitelists(space, password, region, spaceData);

   // 4. Process remaining tags
   const tagsResults = await handleTags(/* ... */);

   // 5. Process remaining groups
   const groupsResults = await handleComponentGroups(/* ... */);
   ```

3. **Component Phase**
   ```typescript
   // 6. Finally process the hero component
   const componentsResults = await handleComponents({
     space,
     spaceData,
     groupsUuidMap, // Contains mappings of old->new UUIDs
     tagsIdMaps // Contains mappings of old->new IDs
   });
   ```

#### 2. Component with Folders
```bash
storyblok components push component-inside-deep-folder --space 295018 --from 295017
```

Flow:
1. **Group Hierarchy**
   ```typescript
   // 1. Find all parent groups (Folder B -> Folder C)
   function getGroupHierarchy(group: SpaceComponentGroup, allGroups: SpaceComponentGroup[]) {
     const hierarchy = [group];
     while (currentGroup.parent_uuid) {
       // Add parent to hierarchy
     }
     return hierarchy;
   }

   // 2. Process groups in order (parent first)
   for (const group of hierarchy) {
     const updatedGroup = await upsertComponentGroup(space, group, /* ... */);
     groupsUuidMap.set(group.uuid, updatedGroup.uuid);
   }
   ```

2. **Component Update**
   ```typescript
   // 3. Update component with new group UUID
   const componentToUpdate = { ...component };
   if (component.component_group_uuid) {
     const newGroupUuid = groupsUuidMap.get(component.component_group_uuid);
     componentToUpdate.component_group_uuid = newGroupUuid;
   }
   ```

#### 3. Component with Whitelists
```bash
storyblok components push page --space 295017
```

If page.json has:
```json
{
  "name": "page",
  "schema": {
    "body": {
      "type": "bloks",
      "restrict_type": "groups",
      "component_group_whitelist": ["group-uuid-1"],
      "component_whitelist": ["hero", "teaser"]
    }
  }
}
```

Flow:
1. **Whitelist Processing**
   ```typescript
   // 1. Collect all whitelist dependencies
   const dependencies = collectWhitelistDependencies(component.schema);
   // Result: {
   //   groupUuids: ["group-uuid-1"],
   //   componentNames: ["hero", "teaser"]
   // }

   // 2. Process whitelisted components first
   const whitelistedComponents = spaceData.components.filter(
     c => dependencies.componentNames.has(c.name)
   );
   ```

2. **Update References**
   ```typescript
   // 3. Update schema with new mappings
   updateSchemaWhitelists(
     schema,
     groupsUuidMap, // group-uuid-1 -> new-uuid
     tagsIdMap, // tag mappings
     componentNameMap // component name mappings if renamed
   );
   ```

### Key Architecture Points

1. **Dependency Order**
   - Whitelists → Tags → Groups → Components
   - This order ensures all references exist before they're needed

2. **ID/UUID Mapping**
   ```typescript
   const maps = {
     groupsUuidMap: new Map<string, string>(), // old UUID -> new UUID
     tagsIdMap: new Map<number, number>(), // old ID -> new ID
     componentNameMap: new Map<string, string>() // old name -> new name
   };
   ```

3. **Two-Pass System**
   ```typescript
   // First Pass: Create/update basic component
   const updatedComponent = await upsertComponent(space, component);

   // Second Pass (only if needed): Update whitelists
   if (hasWhitelists(component.schema)) {
     await upsertComponent(space, updatedComponent);
   }
   ```

4. **Error Handling**
   ```typescript
   const results = {
     successful: [] as string[],
     failed: [] as Array<{ name: string; error: unknown }>
   };
   ```

This architecture ensures:
- Dependencies are handled correctly
- IDs and UUIDs are properly mapped
- Folder structures are maintained
- Whitelists are processed in the correct order
- Errors are properly tracked and reported

## Command Options

| Option | Alias | Description |
|--------|-------|-------------|
| `--space <spaceId>` | `-s` | (Required) The target space ID to push components to |
| `--from <spaceId>` | `-f` | Source space ID (if different from target) |
| `--filter <pattern>` | `--fi` | Glob pattern to filter components to push |
| `--separate-files` | `--sf` | Read from separate files instead of consolidated files |
| `--path <path>` | `-p` | Custom path to read the files from (default: ".storyblok/components/{spaceId}") |
| `--verbose` | `-v` | Show detailed logs and error messages |

## Push Behavior

When pushing components, the command follows these rules:

1. **Dependencies First**: The command automatically handles dependencies in the correct order:
   - First, it processes whitelists (if any)
     - Components
     - Tags
     - Groups
   - Then, it creates/updates tags
   - Next, it handles component groups (maintaining hierarchy)
   - Finally, it processes the components themselves

2. **Smart Updates**: When pushing a specific component or using a filter:
   - Only the specified component(s) will be created/updated
   - Required dependencies (tags, groups) are automatically identified and created
   - Existing dependencies are reused rather than duplicated

3. **File Mode Matching**:
   - If you pulled components with `--separate-files`, you should push with `--separate-files`
   - If you pulled components in consolidated mode, push without the `--separate-files` flag

## Examples

```bash
# Push all components to a target space
storyblok components push --space 295017

# Required files:
.storyblok/
└── components/
    └── 295017/
        ├── components.json    # All components schemas
        ├── groups.json       # Component groups
        ├── presets.json     # Component presets
        └── tags.json        # Internal tags

# Push a specific component
storyblok components push hero --space 295017

# Required files (either):
.storyblok/
└── components/
    └── 295017/
        └── hero.json        # If using separate files
# OR
.storyblok/
└── components/
    └── 295017/
        └── components.json  # If using consolidated files (containing hero component)

# Push components from a different source space
storyblok components push --space 295017 --from 123456

# Required files:
.storyblok/
└── components/
    └── 123456/            # Note: files are read from source space ID
        ├── components.json
        ├── groups.json
        ├── presets.json
        └── tags.json

# Push using a filter pattern
storyblok components push --space 295017 --filter "page*"

# Required files:
.storyblok/
└── components/
    └── 295017/
        ├── components.json  # Must contain components matching "page*"
        ├── groups.json     # Groups used by matching components
        ├── presets.json    # Presets used by matching components
        └── tags.json       # Tags used by matching components

# Push from separate files
storyblok components push --space 295017 --separate-files

# Required files:
.storyblok/
└── components/
    └── 295017/
        ├── groups.json
        ├── presets.json
        ├── tags.json
        ├── hero.json
        ├── hero.presets.json
        ├── page.json
        └── teaser.json      # All component files

# Push from a custom path
storyblok components push --space 295017 --path ./backup/components

# Required files:
backup/
└── components/
    ├── components.json
    ├── groups.json
    ├── presets.json
    └── tags.json
```

## Manual Testing Checklist

1. Basic Push Operations
   - [ ] Push all components to a space (consolidated files)
   - [ ] Push a single component by name
   - [ ] Verify components are created in target space
   - [ ] Check if component configurations match source

2. Dependency Handling
   - [ ] Push component with nested groups
   - [ ] Push component with tags
   - [ ] Verify groups hierarchy is maintained
   - [ ] Check if tags are created correctly

3. Filter and Source Options
   - [ ] Push using filter pattern
   - [ ] Push from different source space
   - [ ] Test filter with nested dependencies
   - [ ] Verify filtered components only are pushed

4. File Mode Testing
   - [ ] Push from separate files
   - [ ] Push from consolidated files
   - [ ] Test file mode mismatches
   - [ ] Verify error handling for missing files

5. Error Cases
   - [ ] Push without space ID
   - [ ] Push with invalid space ID
   - [ ] Push non-existent component
   - [ ] Push with invalid file structure
   - [ ] Test verbose error output

6. Special Cases
   - [ ] Push components with presets
   - [ ] Push components with whitelists
   - [ ] Test custom path scenarios
   - [ ] Verify component updates vs creation
