# Testing checklist

## Running migrations `storyblok migrations run`

## General

- [ ] It should show the command title
- [ ] It should throw an error if the user is not logged in `You are currently not logged in. Please login first to get your user info.`

### Required Arguments

#### `[componentName]` (optional)
- [ ] It should run migrations for all components if no component name is provided
- [ ] It should run only migrations that match the component name pattern if provided
- [ ] It should match migrations that start with the component name and are followed by either the end of the filename or a dot

### `-s, --space=TARGET_SPACE_ID`

- [ ] It should read migration files from `.storyblok/migrations/<TARGET_SPACE_ID>/`
- [ ] It should fetch stories from the target space
- [ ] It should fetch full content for each story
- [ ] It should apply migrations to the stories
- [ ] It should update the modified stories in Storyblok

#### Error handling
- [ ] It should throw an error if the space is not provided: `Please provide the space as argument --space YOUR_SPACE_ID.`
- [ ] It should throw an error if no migration files are found
- [ ] It should throw an error if no stories are found

### Options

#### `--filter, --fi=<pattern>`
- [ ] It should apply glob filter to migration files before running them
- [ ] It should support patterns like `*.amount.js` to run specific migrations
- [ ] It should show a warning if no migrations match the filter

#### `--dry-run, -d`
- [ ] It should preview changes without applying them to Storyblok
- [ ] It should show what changes would be made
- [ ] It should not call updateStory API

#### `--query, -q=<query>`
- [ ] It should filter stories by content attributes using Storyblok filter query syntax
- [ ] Example: `--query="[highlighted][in]=true"`

#### `--starts-with=<path>`
- [ ] It should filter stories by path
- [ ] Example: `--starts-with="/en/blog/"`

#### `--publish=<mode>`
Supports different publication modes:
- [ ] `all`: Should publish all stories after migration
- [ ] `published`: Should only publish stories that were already published
- [ ] `published-with-changes`: Should only publish stories that have unpublished changes after migration
- [ ] No value: Should not publish any stories

### Migration Results

- [ ] It should show a summary of successful migrations
- [ ] It should show a summary of failed migrations
- [ ] It should show a summary of skipped migrations
- [ ] It should show update progress for each story
- [ ] It should show final success/failure counts

### Examples

```bash
# Run all migrations in a space
storyblok migrations run --space 12345

# Run migrations for a specific component
storyblok migrations run hero --space 12345

# Run specific migrations using a filter
storyblok migrations run --space 12345 --filter "*.amount.js"

# Preview changes without applying them
storyblok migrations run --space 12345 --dry-run

# Run migrations and publish all stories
storyblok migrations run --space 12345 --publish all

# Run migrations only on blog posts
storyblok migrations run --space 12345 --starts-with "/en/blog/"

# Run migrations on specific stories
storyblok migrations run --space 12345 --query "[highlighted][in]=true"
```

### Notes

1. Migration files should be JavaScript files that export a default function
2. Each migration function receives a block parameter and should return the modified block
3. Migration files can be component-specific (e.g., `hero.js`) or field-specific using suffixes (e.g., `hero.amount.js`)
4. The command supports dry-run mode for safely previewing changes
5. Publication modes allow flexible control over which stories get published after migration
