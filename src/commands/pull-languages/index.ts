import { colorPalette, commands } from '../../constants'
import { CommandError, handleError, konsola } from '../../utils'
import { getProgram } from '../../program'
import { session } from '../../session'
import { pullLanguages, saveLanguagesToFile } from './actions'
import chalk from 'chalk'
import type { PullLanguagesOptions } from './constants'

const program = getProgram() // Get the shared singleton instance

export const pullLanguagesCommand = program
  .command('pull-languages')
  .description(`Download your space's languages schema as json`)
  .option('-s, --space <space>', 'space ID')
  .option('-p, --path <path>', 'path to save the file. Default is .storyblok/languages')
  .option('-f, --filename <filename>', 'filename to save the file as <filename>.<suffix>.json')
  .option('-su, --suffix <suffix>', 'suffix to add to the file name (e.g. languages.<suffix>.json). By default, the space ID is used.')
  .action(async (options: PullLanguagesOptions) => {
    konsola.title(` ${commands.PULL_LANGUAGES} `, colorPalette.PULL_LANGUAGES, 'Pulling languages...')
    // Global options
    const verbose = program.opts().verbose
    // Command options
    const { space, path, filename = 'languages', suffix = options.space } = options

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
      const internationalization = await pullLanguages(space, state.password, state.region)

      if (!internationalization || internationalization.languages?.length === 0) {
        konsola.warn(`No languages found in the space ${space}`)
        return
      }
      await saveLanguagesToFile(space, internationalization, options)
      konsola.ok(`Languages schema downloaded successfully at ${chalk.hex(colorPalette.PRIMARY)(path ? `${path}/${filename}.${suffix}.json` : `.storyblok/languages/${filename}.${suffix}.json`)}`)
    }
    catch (error) {
      handleError(error as Error, verbose)
    }
  })
