import chalk from 'chalk'
import { colorPalette, commands } from '../../constants'
import { session } from '../../session'
import { getProgram } from '../../program'
import { CommandError, handleError, konsola } from '../../utils'
import { pullComponents, saveComponentsToFiles } from './actions'

const program = getProgram() // Get the shared singleton instance

export const pullComponentsCommand = program
  .command('pull-components')
  .description(`Download your space's components schema as json`)
  .option('-s, --space <space>', 'space ID')
  .option('-p, --path <path>', 'path to save the file')
  .option('-f, --filename <filename>', 'custom name to be used in file(s) name instead of space id')
  .option('--sf, --separate-files [value]', 'Argument to create a single file for each component')
  .action(async (options) => {
    konsola.title(` ${commands.PULL_COMPONENTS} `, colorPalette.PULL_COMPONENTS, 'Pulling components...')
    // Global options
    const verbose = program.opts().verbose
    // Command options
    const { space, path, filename, separateFiles } = options

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
      const components = await pullComponents(space, state.password, state.region)

      if (!components || components.length === 0) {
        konsola.warn(`No components found in the space ${space}`)
        return
      }
      await saveComponentsToFiles(space, components, {
        path,
        filename,
        separateFiles,
      })
      const msgFilename = filename ? `${filename}.json` : `components.${space}.json`

      if (separateFiles) {
        if (filename) {
          konsola.warn(`The --filename option is ignored when using --separate-files`)
        }
        konsola.ok(`Components downloaded successfully in ${chalk.hex(colorPalette.PRIMARY)(path ? `${path}` : './')}`)
        return
      }
      konsola.ok(`Components downloaded successfully in ${chalk.hex(colorPalette.PRIMARY)(path ? `${path}/${msgFilename}` : `${msgFilename}`)}`)
    }
    catch (error) {
      handleError(error as Error, verbose)
    }
  })
