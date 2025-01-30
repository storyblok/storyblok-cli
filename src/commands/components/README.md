# Testing checklist

## Pushing components `storyblok components push`

## General

- [ ] It should show the command title
- [ ] It should trow an error if the user is not logged in `You are currently not logged in. Please login first to get your user info.`
-
### `-s=TARGET_SPACE_ID`

- [ ] It should read the components files and related resources from **consolidated files**[^1] `.storyblok/components/<TARGET_SPACE_ID>/`
  - [ ] It should upsert tags if consolidated files are found `.storyblok/components/<TARGET_SPACE_ID>/tags.json`
  - [ ] It should upsert presets if consolidated files are found `.storyblok/components/<TARGET_SPACE_ID>/presets.json`
  - [ ] It should upsert groups if consolidated files are found `.storyblok/components/<TARGET_SPACE_ID>/groups.json`
    - [ ] It should upsert deep nested groups if consolidated files are found `.storyblok/components/<TARGET_SPACE_ID>/groups.json`
  - [ ] It should upsert the components to the target space `.storyblok/components/<TARGET_SPACE_ID>/components.json`
  - [ ] It should resolve component whitelists (folders, components, tags)

#### Error handling
- [ ] It should throw and error if the space is not provided: `Please provide the target space as argument --space YOUR_SPACE_ID. `

### `-f=SOURCE_SPACE_ID`

- [ ] It should use the target space as source if no source space is provided
- [ ] It should read the components files from `.storyblok/components/<SOURCE_SPACE_ID>/`
- [ ] It should upsert the components to the target space from the source space

#### Error handling

- [ ] It should throw an error if the source space does not exist: `The space folder 'SOURCE_SPACE_ID' doesn't exist yet. Please run 'storyblok components pull -s=SOURCE_SPACE_ID' first to fetch the components.`
- [ ] It should throw a warning if the source space does not have any components (ex components.json is empty or doesn't exist): `No components found that meet the filter criteria. Please make sure you have pulled the components first and that the filter is correct.`

### `--separate-files`

[^1] Consolidated files are the default way to store components. They are a single file for each resource (components.json, groups.json, presets.json, tags.json).
