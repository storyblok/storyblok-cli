# Testing checklist

## Rolling back migrations `storyblok migrations rollback`

## General

- [ ] It should show the command title
- [ ] It should throw an error if the user is not logged in `You are currently not logged in. Please login first to get your user info.`

### Required Arguments

#### `[migrationFile]` (required)
- [ ] It should specify which migration to rollback
- [ ] It should find the corresponding rollback file in `.storyblok/migrations/<TARGET_SPACE_ID>/rollbacks/`
- [ ] It should restore stories to their state before the migration was applied

### `-s, --space=TARGET_SPACE_ID`

- [ ] It should read rollback files from `.storyblok/migrations/<TARGET_SPACE_ID>/rollbacks/`
- [ ] It should restore stories from the rollback file
- [ ] It should update each story with its original content
- [ ] It should handle multiple stories in a single rollback

#### Error handling
- [ ] It should throw an error if the space is not provided: `Please provide the space as argument --space YOUR_SPACE_ID.`
- [ ] It should throw an error if the rollback file is not found
- [ ] It should throw an error if the rollback file is invalid or corrupted
- [ ] It should handle story update failures gracefully

### Options

#### `--path=<path>`
- [ ] It should use a custom path for finding rollback files instead of the default `.storyblok/`
- [ ] It should maintain the same directory structure under the custom path

#### `--verbose`
- [ ] It should show detailed progress information
- [ ] It should show more detailed error messages when failures occur

### Rollback Process

- [ ] It should read the rollback file containing original story states
- [ ] It should restore each story to its pre-migration state
- [ ] It should show progress for each story being restored
- [ ] It should continue with remaining stories if one fails
- [ ] It should use spinners to indicate progress
- [ ] It should show success/failure messages for each story

### Examples

```bash
# Rollback a specific migration
storyblok migrations rollback migration-name.12345678.json --space 12345

# Rollback using a custom path
storyblok migrations rollback migration-name.12345678.json --space 12345 --path /custom/path

# Rollback with verbose output
storyblok migrations rollback migration-name.12345678.json --space 12345 --verbose
```

### Notes

1. Rollback files are automatically created when running migrations
2. Rollback files are stored in `.storyblok/migrations/<SPACE_ID>/rollbacks/`
3. Rollback files contain the original state of all modified stories
4. Rollback files are named with the pattern: `<migration-name>.<timestamp>.json`
5. The rollback process restores stories to their exact state before the migration
6. Stories are updated one by one to minimize the risk of data loss
7. The process continues even if some stories fail to update
8. Verbose mode provides detailed progress information

### File Structure

```
.storyblok/
└── migrations/
    └── 12345/
        ├── hero.js
        └── article.amount.js
        └── rollbacks/
            ├── hero.1647123456789.json
            └── article.amount.1647123456790.json
```

### Rollback File Format

```json
{
  "stories": [
    {
      "storyId": 123,
      "name": "Story Name",
      "content": {
        // Original story content
      }
    }
  ]
}
```
