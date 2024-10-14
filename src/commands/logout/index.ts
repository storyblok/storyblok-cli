import { isAuthorized, removeNetrcEntry } from '../../creds'
import { commands } from '../../constants'
import { getProgram } from '../../program'
import { handleError, konsola } from '../../utils'

const program = getProgram() // Get the shared singleton instance

export const logoutCommand = program
  .command(commands.LOGOUT)
  .description('Logout from the Storyblok CLI')
  .action(async () => {
    const isAuth = await isAuthorized()
    if (!isAuth) {
      konsola.ok(`You are already logged out. If you want to login, please use the login command.`)
      return
    }
    try {
      await removeNetrcEntry()

      konsola.ok(`Successfully logged out`)
    }
    catch (error) {
      handleError(error as Error, true)
    }
  })
