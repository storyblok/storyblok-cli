import chalk from 'chalk'
import { commands, regions } from '../../constants'
import { getProgram } from '../../program'
import { formatHeader, handleError, isRegion, konsola } from '../../utils'
import { loginWithToken } from './actions'
import { select } from '@inquirer/prompts'

const program = getProgram() // Get the shared singleton instance

const allRegionsText = Object.values(regions).join(', ')

const loginStrategy
  = {
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
  }
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
    const { token, Ci, region } = options

    if (token || Ci) {
      console.log('CI version')
    }
    if (!isRegion(region)) {
      konsola.error(new Error(`The provided region: ${region} is not valid. Please use one of the following values: ${Object.values(regions).join(' | ')}`), true)
    }
    else {
      console.log(formatHeader(chalk.bgHex('#8556D3').bold.white(` ${commands.LOGIN} `)))

      const strategy = await select(loginStrategy)
      try {
        if (strategy === 'login-with-token') {
          loginWithToken()
        }

        else {
          console.log('Not implemented yet')
        }
      }
      catch (error) {
        handleError(error as Error)
      }
    }
  })
