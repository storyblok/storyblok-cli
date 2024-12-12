import chalk from 'chalk'
import { colorPalette, commands } from '../../constants'
import { session } from '../../session'
import { getProgram } from '../../program'
import { CommandError, handleError, konsola } from '../../utils'
import { fetchComponentGroups, fetchComponentPresets, fetchComponents, saveComponentPresetsToFiles, saveComponentsToFiles } from './actions'
import type { PullComponentsOptions } from './constants'

const program = getProgram() // Get the shared singleton instance

export const componentsCommand = program
  .command('components')
  .description(`Manage your space's block schema`)
  .option('-s, --space <space>', 'space ID')
  .option('-p, --path <path>', 'path to save the file. Default is .storyblok/components')

componentsCommand
  .command('pull')
  .option('-f, --filename <filename>', 'custom name to be used in file(s) name instead of space id')
  .option('--sf, --separate-files [value]', 'Argument to create a single file for each component')
  .option('--su, --suffix <suffix>', 'suffix to add to the file name (e.g. components.<suffix>.json). By default, the space ID is used.')
  .description(`Download your space's components schema as json`)
  .action(async (options: PullComponentsOptions) => {
    konsola.title(` ${commands.COMPONENTS} `, colorPalette.COMPONENTS, 'Pulling components...')
    // Global options
    const verbose = program.opts().verbose
    // Command options
    const { space, path } = componentsCommand.opts()
    const { separateFiles, suffix = space, filename = 'components' } = options

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
      const components = await fetchComponents(space, state.password, state.region)
      const presets = await fetchComponentPresets(space, state.password, state.region)

      if (!components || components.length === 0) {
        konsola.warn(`No components found in the space ${space}`)
        return
      }

      // Save everything using the new structure
      await saveComponentsToFiles(space, components, groups || [], presets || [], { ...options, path })

      if (separateFiles) {
        if (filename !== 'components') {
          konsola.warn(`The --filename option is ignored when using --separate-files`)
        }
        konsola.ok(`Components downloaded successfully in ${chalk.hex(colorPalette.PRIMARY)(path ? `${path}` : './storyblok/components')}`)
      }
      else {
        const msgFilename = `${filename}.${suffix}.json`
        konsola.ok(`Components downloaded successfully in ${chalk.hex(colorPalette.PRIMARY)(path ? `${path}/${msgFilename}` : `./storyblok/components/${msgFilename}`)}`)
      }

      // Fetch component groups
      /*       const componentGroups = await fetchComponentGroups(space, state.password, state.region)

      if (!componentGroups || componentGroups.length === 0) {
        konsola.warn(`No component groups found in the space ${space}`)
        return
      }

      await saveComponentsToFiles(space, componentGroups, { ...options, path, filename: 'groups' })

      konsola.ok(`Component groups downloaded successfully in ${chalk.hex(colorPalette.PRIMARY)(path ? `${path}/groups.${suffix}.json` : `./storyblok/components/groups.${suffix}.json`)}`) */
    }
    catch (error) {
      handleError(error as Error, verbose)
    }
  })
