import chalk from 'chalk'
import { colorPalette, commands } from '../../constants'
import { session } from '../../session'
import { getProgram } from '../../program'
import { APIError, CommandError, handleError, konsola } from '../../utils'
import { fakePushComponent, fakePushComponentInternalTag, fetchComponent, fetchComponentGroups, fetchComponentInternalTags, fetchComponentPresets, fetchComponents, pushComponent, pushComponentInternalTag, readComponentsFiles, saveComponentsToFiles } from './actions'
import type { PullComponentsOptions, PushComponentsOptions } from './constants'

import { Spinner } from '@topcli/spinner'

const program = getProgram() // Get the shared singleton instance

export const componentsCommand = program
  .command('components')
  .alias('comp')
  .description(`Manage your space's block schema`)
  .requiredOption('-s, --space <space>', 'space ID')
  .option('-p, --path <path>', 'path to save the file. Default is .storyblok/components')

componentsCommand
  .command('pull [componentName]')
  .option('-f, --filename <filename>', 'custom name to be used in file(s) name instead of space id')
  .option('--sf, --separate-files [value]', 'Argument to create a single file for each component')
  .option('--su, --suffix <suffix>', 'suffix to add to the file name (e.g. components.<suffix>.json). By default, the space ID is used.')
  .description(`Download your space's components schema as json. Optionally specify a component name to pull a single component.`)
  .action(async (componentName: string | undefined, options: PullComponentsOptions) => {
    konsola.title(` ${commands.COMPONENTS} `, colorPalette.COMPONENTS, componentName ? `Pulling component ${componentName}...` : 'Pulling components...')
    // Global options
    const verbose = program.opts().verbose
    // Command options
    const { space, path } = componentsCommand.opts()
    const { separateFiles, suffix, filename = 'components' } = options

    const { state, initializeSession } = session()
    await initializeSession()

    if (!state.isLoggedIn || !state.password || !state.region) {
      handleError(new CommandError(`You are currently not logged in. Please login first to get your user info.`), verbose)
      return
    }
    if (!space) {
      handleError(new CommandError(`Please provide the space as argument --space YOUR_SPACE_ID.`), verbose)
      return
    }

    try {
      // Fetch components groups
      const spinnerGroups = new Spinner()
        .start(`Fetching ${chalk.hex(colorPalette.COMPONENTS)('components groups')}`)

      const groups = await fetchComponentGroups(space, state.password, state.region)
      spinnerGroups.succeed(`${chalk.hex(colorPalette.COMPONENTS)('Groups')} - Completed in ${spinnerGroups.elapsedTime.toFixed(2)}ms`)

      // Fetch components presets
      const spinnerPresets = new Spinner()
        .start(`Fetching ${chalk.hex(colorPalette.COMPONENTS)('components presets')}`)

      const presets = await fetchComponentPresets(space, state.password, state.region)
      spinnerPresets.succeed(`${chalk.hex(colorPalette.COMPONENTS)('Presets')} - Completed in ${spinnerPresets.elapsedTime.toFixed(2)}ms`)

      // Fetch components internal tags
      const spinnerInternalTags = new Spinner()
        .start(`Fetching ${chalk.hex(colorPalette.COMPONENTS)('components internal tags')}`)

      const internalTags = await fetchComponentInternalTags(space, state.password, state.region)
      spinnerInternalTags.succeed(`${chalk.hex(colorPalette.COMPONENTS)('Tags')} - Completed in ${spinnerInternalTags.elapsedTime.toFixed(2)}ms`)

      // Save everything using the new structure
      let components
      const spinnerComponents = new Spinner()
        .start(`Fetching ${chalk.hex(colorPalette.COMPONENTS)('components')}`)

      if (componentName) {
        const component = await fetchComponent(space, componentName, state.password, state.region)
        if (!component) {
          konsola.warn(`No component found with name "${componentName}"`)
          return
        }
        components = [component]
      }
      else {
        components = await fetchComponents(space, state.password, state.region)
        if (!components || components.length === 0) {
          konsola.warn(`No components found in the space ${space}`)
          return
        }
      }
      spinnerComponents.succeed(`${chalk.hex(colorPalette.COMPONENTS)('Components')} - Completed in ${spinnerComponents.elapsedTime.toFixed(2)}ms`)
      await saveComponentsToFiles(
        space,
        { components, groups: groups || [], presets: presets || [], internalTags: internalTags || [] },
        { ...options, path, separateFiles: separateFiles || !!componentName },
      )
      konsola.br()
      if (separateFiles) {
        if (filename !== 'components') {
          konsola.warn(`The --filename option is ignored when using --separate-files`)
        }
        const filePath = path ? `${path}/` : `.storyblok/components/${space}/`

        konsola.ok(`Components downloaded successfully to ${chalk.hex(colorPalette.PRIMARY)(filePath)}`)
      }
      else if (componentName) {
        const fileName = suffix ? `${filename}.${suffix}.json` : `${componentName}.json`
        const filePath = path ? `${path}/${fileName}` : `.storyblok/components/${space}/${fileName}`
        konsola.ok(`Component ${chalk.hex(colorPalette.PRIMARY)(componentName)} downloaded successfully in ${chalk.hex(colorPalette.PRIMARY)(filePath)}`)
      }
      else {
        const fileName = suffix ? `${filename}.${suffix}.json` : `${filename}.json`
        const filePath = path ? `${path}/${fileName}` : `.storyblok/components/${space}/${fileName}`

        konsola.ok(`Components downloaded successfully to ${chalk.hex(colorPalette.PRIMARY)(filePath)}`)
      }
    }
    catch (error) {
      handleError(error as Error, verbose)
    }
  })

componentsCommand
  .command('push [componentName]')
  .description(`Push your space's components schema as json`)
  .option('-f, --from <from>', 'source space id')
  .option('--fi, --filter <filter>', 'glob filter to apply to the components before pushing')
  .option('--sf, --separate-files', 'Read from separate files instead of consolidated files')
  .action(async (componentName: string | undefined, options: PushComponentsOptions) => {
    konsola.title(` ${commands.COMPONENTS} `, colorPalette.COMPONENTS, componentName ? `Pushing component ${componentName}...` : 'Pushing components...')
    // Global options
    const verbose = program.opts().verbose
    const { space, path } = componentsCommand.opts()
    const { filter } = options

    const { state, initializeSession } = session()
    await initializeSession()

    if (!state.isLoggedIn || !state.password || !state.region) {
      handleError(new CommandError(`You are currently not logged in. Please login first to get your user info.`), verbose)
      return
    }
    if (!space) {
      handleError(new CommandError(`Please provide the space as argument --space YOUR_SPACE_ID.`), verbose)
      return
    }

    try {
      const spaceData = await readComponentsFiles({
        ...options,
        path,
      })

      if (!spaceData.components.length) {
        let message = 'No components found that meet the filter criteria. Please make sure you have pulled the components first and that the filter is correct.'
        if (options.separateFiles) {
          message = 'No components found that meet the filter criteria with the separate files. Please make sure you have pulled the components first and that the filter is correct.'
        }
        konsola.warn(message)
        return
      }

      const results = {
        successful: [] as string[],
        failed: [] as Array<{ name: string, error: unknown }>,
      }

      await Promise.all(spaceData.components.map(async (component) => {
        const spinner = new Spinner()
          .start(`${chalk.hex(colorPalette.COMPONENTS)(component.name)} - Pushing...`)
        try {
          if (component.internal_tag_ids.length > 0) {
            spinner.text = `Pushing ${chalk.hex(colorPalette.COMPONENTS)(component.name)} internal tags...`
            await Promise.all(component.internal_tag_ids.map(async (tagId) => {
              const tag = spaceData.internalTags.find(tag => tag.id === Number(tagId))
              if (tag) {
                try {
                  await pushComponentInternalTag(space, tag, state.password, state.region)
                }
                catch (error) {
                  konsola.warn(`Failed to push internal tag ${tag.name}`)
                }
              }
            }))
          }
          await pushComponent(space, component, state.password, state.region)
          // await pushComponent(space, component, state.password, state.region)
          spinner.succeed(`${chalk.hex(colorPalette.COMPONENTS)(component.name)} - Completed in ${spinner.elapsedTime.toFixed(2)}ms`)
        }
        catch (error) {
          let spinnerFailedMessage = `${chalk.hex(colorPalette.COMPONENTS)(component.name)} - Failed`
          if (error instanceof APIError && error.code === 422) {
            if (error.response?.data?.name && error.response?.data?.name[0] === 'has already been taken') {
              spinnerFailedMessage = `${chalk.hex(colorPalette.COMPONENTS)(component.name)} - Failed: a component with this name already exists.`
            }
          }
          spinner.failed(spinnerFailedMessage)
          results.failed.push({ name: component.name, error })
        }
      }))

      if (results.failed.length > 0) {
        if (!verbose) {
          konsola.br()
          konsola.info('For more information about the error, run the command with the `--verbose` flag')
        }
        else {
          results.failed.forEach((failed) => {
            handleError(failed.error as Error, verbose)
          })
        }
      }

      if (filter) {
        konsola.info('Filter applied:', filter)
      }
    }
    catch (error) {
      handleError(error as Error, verbose)
    }
  })
