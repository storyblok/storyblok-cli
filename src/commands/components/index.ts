import chalk from 'chalk'
import { colorPalette, commands } from '../../constants'
import { session } from '../../session'
import { getProgram } from '../../program'
import { CommandError, handleError, konsola } from '../../utils'
import { fetchComponent, fetchComponentGroups, fetchComponentPresets, fetchComponents, pushComponent, readComponentsFiles, saveComponentsToFiles } from './actions'
import type { PullComponentsOptions, PushComponentsOptions } from './constants'

const program = getProgram() // Get the shared singleton instance

export const componentsCommand = program
  .command('components')
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
      // Fetch all data first
      const groups = await fetchComponentGroups(space, state.password, state.region)
      const presets = await fetchComponentPresets(space, state.password, state.region)

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

      // Save everything using the new structure
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
        konsola.ok(`Components downloaded successfully in ${chalk.hex(colorPalette.PRIMARY)(filePath)}`)
      }
      else if (componentName) {
        const fileName = suffix ? `${filename}.${suffix}.json` : `${componentName}.json`
        const filePath = path ? `${path}/${fileName}` : `.storyblok/components/${space}/${fileName}`
        konsola.ok(`Component ${chalk.hex(colorPalette.PRIMARY)(componentName)} downloaded successfully in ${chalk.hex(colorPalette.PRIMARY)(filePath)}`)
      }
      else {
        const fileName = suffix ? `${filename}.${suffix}.json` : `${filename}.json`
        const filePath = path ? `${path}/${fileName}` : `.storyblok/components/${space}/${fileName}`

        konsola.ok(`Components downloaded successfully in ${chalk.hex(colorPalette.PRIMARY)(filePath)}`)
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

      try {
        await pushComponent(space, spaceData.components[0], state.password, state.region)
        results.successful.push(spaceData.components[0].name)
      }
      catch (error) {
        results.failed.push({
          name: spaceData.components[0].name,
          error,
        })
      }
      // Process all components sequentially
      /* for (const component of spaceData.components) {
        try {
          await pushComponent(space, component, state.password, state.region)
          results.successful.push(component.name)
        }
        catch (error) {
          results.failed.push({
            name: component.name,
            error,
          })
        }
      } */

      console.log(results)

      // Display summary
      konsola.ok(`Successfully pushed ${results.successful.length} components:`)
      if (results.successful.length > 0) {
        results.successful.forEach(name => konsola.info(`✓ ${name}`))
      }

      if (results.failed.length > 0) {
        konsola.error('', null, {
          header: true,
        })
        konsola.error(`Failed to push ${results.failed.length} components:`)
        results.failed.forEach(({ name, error }) => {
          konsola.error(`✗ ${name}`, error)
        })
      }

      if (filter) {
        konsola.info('Filter applied:', filter)
      }
    }
    catch (error) {
      handleError(error as Error, verbose)
    }
  })
