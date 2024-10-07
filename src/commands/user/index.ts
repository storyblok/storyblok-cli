import chalk from 'chalk'
import type { NetrcMachine } from '../../creds'
import { commands } from '../../constants'
import { getProgram } from '../../program'
import { formatHeader, handleError, konsola } from '../../utils'
import { getUser } from './actions'
import { session } from '../../session'

const program = getProgram() // Get the shared singleton instance

export const userCommand = program
  .command(commands.USER)
  .description('Get the current user')
  .action(async () => {
    console.log(formatHeader(chalk.bgHex('#8556D3').bold.white(` ${commands.USER} `)))
    const { state, initializeSession } = session()
    await initializeSession()

    if (!state.isLoggedIn) {
      konsola.error(new Error(`You are not logged in. Please login first.
        `))
      return
    }
    try {
      const { password, region } = state as NetrcMachine
      const { user } = await getUser(password, region)
      konsola.ok(`Hi ${chalk.bold(user.friendly_name)}, you are currently logged in with ${chalk.hex('#45bfb9')(user.email)} on ${chalk.bold(region)} region`)
    }
    catch (error) {
      handleError(error as Error, true)
    }
  })
