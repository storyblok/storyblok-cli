import chalk from 'chalk'
import { commands } from '../../constants'
import { getProgram } from '../../program'
import { formatHeader, handleError } from '../../utils'

const program = getProgram() // Get the shared singleton instance

export const loginCommand = program
  .command(commands.LOGIN)
  .description('Login to the Storyblok CLI')
  .action(async () => {
    try {
      console.log(formatHeader(chalk.bgHex('#8556D3').bold.white(` ${commands.LOGIN} `)))
      /* login() */
    }
    catch (error) {
      handleError(error as Error)
    }
  })
