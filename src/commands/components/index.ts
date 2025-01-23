import chalk from 'chalk'
import { colorPalette, commands } from '../../constants'
import { session } from '../../session'
import { getProgram } from '../../program'
import { CommandError, handleError, konsola } from '../../utils'
import { fakePushComponent, fetchComponent, fetchComponentGroups, fetchComponentPresets, fetchComponents, pushComponent, readComponentsFiles, saveComponentsToFiles } from './actions'
import type { PullComponentsOptions, PushComponentsOptions } from './constants'

import ora from 'ora'

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
      const spinner = ora(`Fetching ${chalk.hex(colorPalette.COMPONENTS)('components groups')}`).start()

      // Fetch all data first
      const groups = await fetchComponentGroups(space, state.password, state.region)
      spinner.succeed()
      const spinner2 = ora(`Fetching ${chalk.hex(colorPalette.COMPONENTS)('components presets')}`).start()

      const presets = await fetchComponentPresets(space, state.password, state.region)
      spinner2.succeed()

      const spinner3 = ora(`Fetching ${chalk.hex(colorPalette.COMPONENTS)('components')}`).start()
      // Save everything using the new structure
      let components
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
      spinner3.succeed()
      await saveComponentsToFiles(
        space,
        { components, groups: groups || [], presets: presets || [] },
        { ...options, path, separateFiles: separateFiles || !!componentName },
      )

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

      const results = {
        successful: [] as string[],
        failed: [] as Array<{ name: string, error: unknown }>,
      }

      // Process components sequentially to maintain clear output
      for (const component of spaceData.components) {
        const spinner = ora({
          text: `Pushing component: ${chalk.hex(colorPalette.COMPONENTS)(component.name)}`,
          stream: process.stdout,
        }).start()

        try {
          await fakePushComponent(component)
          spinner.succeed(`Pushed component: ${chalk.hex(colorPalette.COMPONENTS)(component.name)}`)
          results.successful.push(component.name)
        }
        catch (error) {
          spinner.fail(`Failed to push component: ${chalk.hex(colorPalette.COMPONENTS)(component.name)}`)
          results.failed.push({ name: component.name, error })
        }
      }

      if (results.failed.length > 0) {
        if (!verbose) {
          konsola.br()
          konsola.info('For more information about the error, run the command with the `--verbose` flag')
        }
        else {
          konsola.error('Failed to push components:', results.failed)
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
