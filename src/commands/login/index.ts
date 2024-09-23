import chalk from 'chalk'
import { commands, regions } from '../../constants'
import { getProgram } from '../../program'
import { formatHeader, handleError } from '../../utils'
import { loginWithToken } from './actions'
import inquirer from 'inquirer'

const program = getProgram() // Get the shared singleton instance

const allRegionsText = Object.values(regions).join(', ')
const loginStrategy = [
  {
    type: 'list',
    name: 'strategy',
    message: 'How would you like to login?',
    choices: [
      {
        name: 'With email',
        value: 'login-with-email',
        short: 'Email',
      },
      {
        name: 'With Token (SSO)',
        value: 'login-with-token',
        short: 'Token',
      },
    ],
  },
]
export const loginCommand = program
  .command(commands.LOGIN)
  .description('Login to the Storyblok CLI')
  .option('-t, --token <token>', 'Token to login directly without questions, like for CI environments')
  .option(
    '-r, --region <region>',
    `The region you would like to work in. Please keep in mind that the region must match the region of your space. This region flag will be used for the other cli's commands. You can use the values: ${allRegionsText}.`,
    regions.EU,
  )
  .option('-ci', '--ci', false)
  .action(async (options) => {
    if (options.token || options.Ci) {
      console.log('CI version')
    }
    else {
      console.log(formatHeader(chalk.bgHex('#8556D3').bold.white(` ${commands.LOGIN} `)))

      const { strategy } = await inquirer.prompt(loginStrategy)
      try {
        if (strategy === 'login-with-token') {
          loginWithToken()
        }
      }
      catch (error) {
        handleError(error as Error)
      }
    }
  })
