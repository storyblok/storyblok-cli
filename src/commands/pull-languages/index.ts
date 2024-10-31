import { colorPalette, commands } from '../../constants'
import { CommandError, handleError, konsola } from '../../utils'
import { getProgram } from '../../program'
import { session } from '../../session'
import { pullLanguages, saveLanguagesToFile } from './actions'
import chalk from 'chalk'

const program = getProgram() // Get the shared singleton instance

export const pullLanguagesCommand = program
  .command('pull-languages')
  .description(`Download your space's languages schema as json`)
  .option('-s, --space <space>', 'space ID')
  .option('-p, --path <path>', 'path to save the file')
  .action(async (options) => {
    konsola.title(` ${commands.PULL_LANGUAGES} `, colorPalette.PULL_LANGUAGES, 'Pulling languages...')
    // Global options
    const verbose = program.opts().verbose
    // Command options
    const { space, path } = options

    const { state, initializeSession } = session()
    await initializeSession()

    if (!state.isLoggedIn) {
      handleError(new CommandError(`You are currently not logged in. Please login first to get your user info.`), verbose)
      return
    }

    if (!space) {
      handleError(new CommandError(`Please provide the space as argument --space YOUR_SPACE_ID.`), verbose)
      return
    }

    try {
      const internationalization = await pullLanguages(space)

      if (!internationalization || !internationalization.languages) {
        konsola.warn(`No languages found in the space ${space}`)
        return
      }
      await saveLanguagesToFile(space, internationalization, path)
      konsola.ok(`Languages schema downloaded successfully at ${chalk.hex(colorPalette.PRIMARY)(path ? `${path}/languages.${space}.json` : `languages.${space}.json`)}`)
    }
    catch (error) {
      handleError(error as Error, verbose)
    }
  })
