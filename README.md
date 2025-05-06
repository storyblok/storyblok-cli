<p align="center">
  <h1 align="center">Storyblok CLI</h1>
  <p align="center">A simple CLI for scaffolding <a href="https://www.storyblok.com?utm_source=github.com&utm_medium=readme&utm_campaign=storyblok" target="_blank">Storyblok</a> projects and fieldtypes.</p>
</p>

[![npm](https://img.shields.io/npm/v/storyblok.svg)](https://www.npmjs.com/package/storyblok)
[![npm](https://img.shields.io/npm/dt/storyblok.svg)](ttps://img.shields.io/npm/dt/storyblok.svg)
[![GitHub issues](https://img.shields.io/github/issues/storyblok/storyblok-cli.svg?style=flat-square&v=1)](https://github.com/storyblok/storyblok/issues?q=is%3Aopen+is%3Aissue)
[![GitHub closed issues](https://img.shields.io/github/issues-closed/storyblok/storyblok-cli.svg?style=flat-square&v=1)](https://github.com/storyblok/storyblok-cli/issues?q=is%3Aissue+is%3Aclosed)

## BREAKING CHANGE

We added the `region` option upon login. If you are using the CLI, please `logout` and `login` again providing your user region.

## Installation

Make sure you have Node `>= 18.0.0` installed.

```sh
$ npm i storyblok -g
```

## Commands


### login

Login to the Storyblok cli

```sh
$ storyblok login
```
#### Login options

##### Options for Login with email and password
* `email`: your user's email address
* `password`: your user's password

##### Options for Login with token (Recomended to SSO user's but works with all user accounts)
* `token`: your personal access token

**Get your personal access token**
* Go to [https://app.storyblok.com/#/me/account?tab=token](https://app.storyblok.com/#/me/account?tab=token) and click on Generate new token.

**For Both login options you nedd to pass the region**

* `region` (default: `eu`): the region you would like to work in. All the supported regions can be found [here](https://www.storyblok.com/faq/define-specific-region-storyblok-api).

> [!NOTE]
> Please keep in mind that the region must match the region of your space, and also that it will be used for all future commands you may perform.

#### Login with token flag
You can also add the token directly from the login’s command, like the example below:

```sh
$ storyblok login --token <PERSONAL_ACCESS_TOKEN> --region eu 
```

### logout

Logout from the Storyblok cli

```sh
$ storyblok logout
```
### user

Get the currently logged in user

```sh
$ storyblok user
```


### select

Usage to kickstart a boilerplate, fieldtype or theme

```sh
$ storyblok select
```

### pull-languages

Download your space's languages schema as json. This command will download 1 file.

```sh
$ storyblok pull-languages --space <SPACE_ID>
```

#### Options

* `space`: your space id

### pull-components

Download your space's components schema as json. By default this command will download 2 files: 1 for the components and 1 for the presets; But if you pass a flag `--separate-files or --sf` the command will create file for each component and presets. And also you could pass a path `--path or -p` to save your components and presets.

It's highly recommended to use also the `--prefix-presets-names` or `-ppn` parameter if you use `--separate-files` because it will prefix the names of the individual files with the name of the component. This feature solves the issue of multiple presets from different components but with the same name, being written in the same file. In a future major version this will become the default behavior.

If you want to resolve datasources for single/multiple option field from your Storyblok components, you can use `--resolve-datasources` or `--rd`, it will fill up the options fields with the datasource's options.

```sh
$ storyblok pull-components --space <SPACE_ID> # Will save files like components-1234.json
```

```sh
$ storyblok pull-components --space <SPACE_ID> --separate-files --prefix-presets-names --file-name production # Will save files like feature-production.json grid-production.json
```

```sh
$ storyblok pull-components --space <SPACE_ID> --resolve-datasources # Will resolve datasources for single/multiple option field
```

#### Options

* `space`: your space id
* `separate-files`: boolean flag to save components and presets in single files instead a file with all
* `path`: the path to save your components and preset files
* `file-name`(optional): a custom filename used to generate the component and present files, default is the space id

### push-components

Push your components file to your/another space

```sh
$ storyblok push-components <SOURCE> --space <SPACE_ID> --presets-source <PRESETS_SOURCE>
```

#### Parameters

* `source`: can be a URL or path to JSON file, the path to a json file could be to a single or multiple files separated by comma, like `./pages-1234.json,../User/components/grid-1234.json`

Using an **URL**

```sh
$ storyblok push-components https://raw.githubusercontent.com/storyblok/nuxtdoc/master/seed.components.json --space 67819
```

Using a **path** to a single file

```sh
$ storyblok push-components ./components.json --space 67819
```

Using a **path** to a multiple files

```sh
$ storyblok push-components ./page.json,../grid.json,./feature.json --space 67819
```

#### Options

* `space`: your space id
* `presets-source` (optional): it can be a URL or path to JSON file with the presets

#### Examples

Using an **URL** for `presets-source`

```sh
$ storyblok push-components https://raw.githubusercontent.com/storyblok/nuxtdoc/master/seed.components.json --presets-source https://url-to-your-presets-file.json --space 67819
```

Using a **path** to file

```sh
$ storyblok push-components ./components.json --presets-source ./presets.json --space 67819
```

### delete-component

Delete a single component on your space.

```sh
storyblok delete-component <component> --space <SPACE_ID>
```

#### Parameters
* `component`: The name or id of the component

#### Options
* `space_id`: the space where the command should be executed.

#### Examples

Delete a component on your space.
```sh
storyblok delete-component 111111 --space 67819
```

```sh
storyblok delete-component teaser --space 67819
```

### delete-components

Delete all components from your Space that occur in your Local JSON.
Or delete those components on your Space that do not appear in the JSON. (`--reverse`)

```sh
storyblok delete-components <SOURCE> --space <SPACE_ID>
```

#### Parameters
* `source`: can be a URL or path to JSON file, the path to a json file could be to a single or multiple files separated by comma, like `./pages-1234.json,../User/components/grid-1234.json`

Using an **URL**

```sh
$ storyblok push-components https://raw.githubusercontent.com/storyblok/nuxtdoc/master/seed.components.json --space 67819
```

Using a **path** to a single file

```sh
$ storyblok push-components ./components.json --space 67819
```

Using a **path** to a multiple files

```sh
$ storyblok push-components ./page.json,../grid.json,./feature.json --space 67819
```

#### Options
* `space_id`: the space where the command should be executed.
* `reverse`: When passed as an argument, deletes only those components on your space that do not appear in the JSON.
* `dryrun`: when passed as an argument, does not perform any changes on the given space.

#### Examples

Delete all components on a certain space that occur in your local JSON.
```sh
storyblok delete-components ./components.json --space 67819
```

Delete only those components which do not occur in your local json from your space.
```sh
storyblok delete-components ./components.json --space 67819 --reverse
```

To see the result in your console output but to not perform the command on your space, use the `--dryrun` argument.
```sh
storyblok delete-components ./components.json --space 67819 --reverse --dryrun
```

### sync

Sync components, folder, roles, datasources or stories between spaces

```sh
$ storyblok sync --type <COMMAND> --source <SPACE_ID> --target <SPACE_ID>
```

#### Options

* `type`: describe the command type to execute. Can be: `folders`, `components`, `stories`, `datasources` or `roles`. It's possible pass multiple types separated by comma (`,`).
* `source`: the source space to use to sync
* `target`: the target space to use to sync
* `starts-with`: sync only stories that starts with the given string
* `filter`: sync stories based on the given filter. Required Options: Required options: `--keys`, `--operations`, `--values`
* `keys`: Multiple keys should be separated by comma. Example: `--keys key1,key2`, `--keys key1`
* `operations`: Operations to be used for filtering. Can be: `is`, `in`, `not_in`, `like`, `not_like`, `any_in_array`, `all_in_array`, `gt_date`, `lt_date`, `gt_int`, `lt_int`, `gt_float`, `lt_float`. Multiple operations should be separated by comma.
* `components-full-sync`: If used, the CLI will override the full component object when synching across spaces.

#### Examples

```sh
# Sync components from `00001` space to `00002` space
$ storyblok sync --type components --source 00001 --target 00002

# Sync components and stories from `00001` space to `00002` space
$ storyblok sync --type components,stories --source 00001 --target 00002

# Sync only stories that starts with `myStartsWithString` from `00001` space to `00002` space
$ storyblok sync --type stories --source 00001 --target 00002 --starts-with myStartsWithString

# Sync only stories with a category field like `reference` from `00001` space to `00002` space
$ storyblok sync --type stories --source 00001 --target 00002 --filter --keys category --operations like --values reference

# Sync only stories with a category field like `reference` and a name field not like `demo` from `00001` space to `00002` space
$ storyblok sync --type stories --source 00001 --target 00002 --filter --keys category,name --operations like,not_like --values reference,demo

```

### quickstart

Create a space in Storyblok and select the boilerplate to use

```sh
$ storyblok quickstart
```

### generate-migration

Create a migration file (with the name `change_<COMPONENT>_<FIELD>.js`) inside the `migrations` folder. Check **Migrations** section to more details

```sh
$ storyblok generate-migration --space <SPACE_ID> --component <COMPONENT_NAME> --field <FIELD>
```
It's important to note that the `component` and `field` parameters are required and must be spelled exactly as they are in Storyblok. You can check the exact name by looking at the `Block library` inside your space.

#### Options

* `space`: space where the component is
* `component`: component name. It needs to be a valid component
* `field`: name of field

### run-migration

Execute a specific migration file. Check **Migrations** section to more details

```sh
$ storyblok run-migration --space <SPACE_ID> --component <COMPONENT_NAME> --field <FIELD> --dryrun
```

Optionally you can provide the publish parameter to publish content after saving. Example:

```sh
$ storyblok run-migration --publish published --space 1234 --component article --field image
```

#### Options

* `space`: the space you get from the space settings area
* `component`: component name. It needs to be a valid component
* `field`: name of field
* `dryrun`: when passed as an argument, does not perform the migration
* `publish` (optional): publish the content when update
  * `all`: publish all stories, even if they have not yet been published
  * `published`: only publish stories that already are published and don't have unpublished changes
  * `published-with-changes`: publish stories that are published and have unpublished changes
* `publish-languages` (optional): publish specific languages. You can publish more than one language at a time by separating the languages by `,`

### rollback-migration

The `rollback-migration` command gives the possibility to undo the changes made from the execution of the last `run-migrations` command.

```sh
$ storyblok rollback-migration --space 1234 --component Product --field title
```

**Important**: The `rollback-migrations` command will only work if there where changes done with `run-migrations`. Therefore running `run-migrations` command with the `--dryrun` flag will NOT create a rollback file.

#### options

* `space`: the space you get from the space settings area
* `component`: component name. It needs to be a valid component
* `field`: name of field

### spaces


List all spaces of the logged account

```sh
$ storyblok spaces
```

### import

This command gives you the possibility to import flat content from `.csv`, `.xml` and `.json` files coming from other systems.

The attributes `path` and `title` are required.

```sh
$ storyblok import --file <FILE_NAME> --type <TYPE_OF_CONTENT> --folder <FOLDER_ID> --delimiter <DELIMITER_TO_CSV_FILES> --space <SPACE_ID>
```

A xml file needs to have following format:

```
<?xml version="1.0" encoding="UTF-8"?>
<root>
  <row>
    <path>this-is-my-title</path>
    <title>This is my title</title>
    <text>Lorem ipsum dolor sit amet</text>
    <image>https://a.storyblok.com/f/51376/x/1502f01431/corporate-website.svg</image>
    <category>press</category>
  </row>
</root>
```

A csv file needs to have following format. The first row is used to identify the attribute names:

```
path;title;text;image;category
this-is-my-title;This is my title;"Lorem ipsum dolor sit amet";https://a.storyblok.com/f/51376/x/1502f01431/corporate-website.svg;press
```

A json file need to have following format:

```json
[ 
  {
    "path": "this-is-my-title",
    "title": "This is my title",
    "text": "Lorem ipsum dolor sit amet",
    "image": "https://a.storyblok.com/f/51376/x/1502f01431/corporate-website.svg",
    "category": "press"
  }
]
```

#### Options

* `file`: name of the file
* `type`: name of the content type you want to use for the import
* `space`: id of your space
* `delimiter` (optional): delimiter of the `.cvs` files, only necessary if you are uploading a csv file (Default value is **;** )
* `folder` (optional): id of the folder where you want to store the content in Storyblok

### Help

For global help

```sh
$ storyblok --help
```

For command help

```sh
$ storyblok sync --help
```

### Version

For view the CLI version

```sh
$ storyblok -V # or --version
```

### delete-datasources

The delete-datasources command enables you to remove all datasources within the designated space. By utilizing the `--by-slug` option, you can filter the datasources based on their slugs, selectively deleting specific datasources. Similarly, the `--by-name` option functions in the same way, allowing you to filter and delete datasources based on their names.

```sh
$ storyblok delete-datasources --space-id <SPACE_ID> # Will delete all datasources
```

```sh
$ storyblok delete-datasources --space-id <SPACE_ID> --by-slug global-translations   # Will only delete datasources where the slug starts with global-translations
```

#### Options

* `space-id`: your space id
* `by-slug`: Filter Datasources by slug
* `by-name`: Filter Datasources by name

## Content migrations

Content migrations are a convenient way to change fields of your content.

To execute a migration you first need to create a migration file. This file is a pure Javascript function where the content of a specific content type or component gets passed through.

### 1. Creating a migration file

To create a migration file, you need to execute the `generate-migration` command:

```sh
# creating a migration file to product component to update the price
$ storyblok generate-migration --space 00000 --component product --field price
```

When you run this command a file called `change_product_price.js` will be created inside a folder called `migrations`.

The created file will have the following content:

```js
// here, 'subtitle' is the name of the field defined when you execute the generate command
module.exports = function (block, slug) {
  // Example to change a string to boolean
  // block.subtitle = !!(block.subtitle)

  // Example to transfer content from other field
  // block.subtitle = block.other_field
}
```

In the migration function you can manipulate the block variable to add or modify existing fields of the component.

### 2. Running the migration file

To run the migration function you need to execute the `run-migration` command. Pass the --dryrun option to not execute the updates and only show the changes in the terminal:

```sh
$ storyblok run-migration --space 00000 --component product --field price --dryrun
```

After checking the output of the dryrun you can execute the updates:

```sh
# you can use the --dryrun option to not execute the updates
$ storyblok run-migration --space 00000 --component product --field price
```

### 3. Publishing the content

You can execute the migration and, when update the content, publish it using the `--publish` and `--publish-languages` options. When you use the `publish` option, **you need to specific one of these following options**: 'all', 'published' or 'published-with-changes':

```sh
$ storyblok run-migration --space 00000 --component product --field price --publish all
```

You can specify the languages to update using `--publish-languages=<LANGUAGE>` or update all languages using `--publish-languages=ALL_LANGUAGES`:

```sh
# to update only one language
$ storyblok run-migration --space 00000 --component product --field price --publish all --publish-languages=de

# to update more than one language
$ storyblok run-migration --space 00000 --component product --field price --publish all --publish-languages=de,pt
```

### 4. Rollback migrations

Whenever you run a `run-migrations` command a json file containing all the content before the change takes place will be generated. **Important**, this just doesn't apply if you add the `--dryrun` flag.

Remembering that, the content that will be saved is always related to the last `run-migrations` command, that is, if you run the `run-migrations` command twice changing the same component, the content will only be saved before the last update.

### Examples

#### 1. Change an image field

Let's create an example to update all occurrences of the image field in product component. In the example we replace the url from `//a.storyblok.com` to `//my-custom-domain.com`.

First, you need to create the migration function:

```sh
$ storyblok generate-migration --space 00000 --component product --field image
```

Then let's update the default image field:

```js
module.exports = function (block) {
  block.image = block.image.replace('a.storyblok.com', 'my-custom-domain.com')
}
```

Now you can execute the migration file:

```sh
$ storyblok run-migration --space 00000 --component product --field image --dryrun
```

#### 2. Transform a Markdown field into a Richtext field


To transform a markdown or html field into a richtext field you first need to install a converter library.

```sh
$ npm install storyblok-markdown-richtext -g
```

Now check the path to the global node modules folder

```sh
$ npm root -g
```

Generate the migration with ```storyblok generate-migration --space 00000 --component blog --field intro``` and apply the transformation:

```js
var richtextConverter = require('/usr/local/lib/node_modules/storyblok-markdown-richtext')

module.exports = function (block) {
  if (typeof block.intro == 'string') {
    block.intro = richtextConverter.markdownToRichtext(block.intro)
  }
}
```

## Typescript
It is possible to generate Typescript type definitions for your Storyblok components. The type definitions are based on the components' JSON Schema that can be retrieved with the [pull-components](#pull-components) command.

### generate-typescript-typedefs

Generate a file with the type definitions for the specified components' JSON Schemas.

```sh
$ storyblok generate-typescript-typedefs
  --sourceFilePaths <PATHS>
  --destinationFilePath <PATH>
  --typeNamesPrefix <STRING>
  --typeNamesSuffix <STRING>
  --JSONSchemaToTSOptionsPath <PATH>
  --customFieldTypesParserPath <PATH>
```

#### Options

* `sourceFilePaths` <sub>(alias `source`)</sub> : Path(s) to the components JSON file(s) as comma separated values
* `destinationFilePath` <sub>(alias `target`) *optional*</sub> : Path to the Typescript file that will be generated (*default*: `storyblok-component-types.d.ts`)
* `typeNamesPrefix` <sub>(alias `titlePrefix`) *optional*</sub> : A prefix that will be prepended to all the names of the generated types
* `typeNamesSuffix` <sub>(alias `titleSuffix`) *optional*</sub> : A suffix that will be appended to all the names of the generated types (*default*: `Storyblok`)
* `JSONSchemaToTSOptionsPath` <sub>(alias `compilerOptions`) *optional*</sub> : Path to a JSON file with a list of options supported by `json-schema-to-typescript`
* `customFieldTypesParserPath` <sub>(alias `customTypeParser`) *optional*</sub> : Path to the parser file for Custom Field Types

#### Examples

```sh
# Generate typedefs for the components retrieved for the space `12345` via the `storyblok pull-components` command
$ storyblok generate-typescript-typedefs --sourceFilePaths ./components.12345.json

# Generate typedefs for multiple components sources
$ storyblok generate-typescript-typedefs --sourceFilePaths ./fooComponent-12345.json,./barComponent-12345.json

# Custom path for the typedefs file
$ storyblok generate-typescript-typedefs --sourceFilePaths ./components.12345.json --destinationFilePath ./types/my-custom-type-file.d.ts

# Provide customized options for the JSON-schema-to-typescript lib
$ storyblok generate-typescript-typedefs --sourceFilePaths ./components.12345.json --JSONSchemaToTSOptionsPath ./PathToJSONFileWithCustomOptions.json

# Provide a custom field types parser
$ storyblok generate-typescript-typedefs --sourceFilePaths ./components.12345.json --customFieldTypesParserPath ./customFieldTypesParser.js

```

##### JSON Schema to Typescript options
This script uses the `json-schema-to-typescript` library under the hood. Values of the [JSON Schema to Typescript options](https://www.npmjs.com/package/json-schema-to-typescript#options) can be customized providing a JSON file to the `JSONSchemaToTSOptionsPath`.

The default values used for the `storyblok generate-typescript-typedefs` command are the same defaults for the library except for two properties:
* `bannerComment` - The default value is `""` to remove noise from the generated Typedefs file
* `unknownAny` - The default value is `false` because it can help a smoother Typescript adoption on a JS project

Example `JSONSchemaToTSOptions` JSON file to remove `additionalProperties` from the generated type definitions:

```json
{
  "additionalProperties": false,
}
```

##### Custom Field Types parser
Storyblok [Custom Field Types](https://www.storyblok.com/docs/plugins/field-plugins/introduction) do not have inherent JSONSchema definitions. To overcome this issue, you can provide a path to a script exporting a parser function that should render a [JSONSchema Node](https://json-schema.org/learn/getting-started-step-by-step#define-properties) for each of your Custom Field Types. The parser function should be exported as a default export, like in the following example:
```js
export default function (key, obj) {
  switch (obj.field_type) {
    case 'my-custom-field-type-name':
      return {
        [key]: {
          type: 'object',
          properties: {
            color: { type: 'string' }
          },
          required: ['color']
        }
      }
    default:
      return {}
  }
}
```





## You're looking for a headstart?

Check out our guides for client side apps (VueJS, Angular, React, ...), static site (Jekyll, NuxtJs, ...), dynamic site examples (Node, PHP, Python, Laravel, ...) on our [Getting Started](https://www.storyblok.com/getting-started) page.
