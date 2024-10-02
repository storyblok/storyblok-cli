import chalk from 'chalk'
import { input, password, select } from '@inquirer/prompts'
import { commands, regionNames, regions, regionsDomain } from '../../constants'
import { getProgram } from '../../program'
import { formatHeader, handleError, isRegion, konsola } from '../../utils'
import { loginWithEmailAndPassword, loginWithOtp, loginWithToken } from './actions'
import { addNetrcEntry } from '../../creds'

const program = getProgram() // Get the shared singleton instance

const allRegionsText = Object.values(regions).join(',')
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
  .action(async (options) => {
    const { token, region } = options
    if (!isRegion(region)) {
      konsola.error(new Error(`The provided region: ${region} is not valid. Please use one of the following values: ${Object.values(regions).join(' | ')}`), true)
    }

    if (token) {
      try {
        const { user } = await loginWithToken(token, region)
        await addNetrcEntry({
          machineName: regionsDomain[region],
          login: user.email,
          password: token,
          region,
        })
        konsola.ok(`Successfully logged in with token`)
      }
      catch (error) {
        handleError(error as Error, true)
      }
    }
    else {
      console.log(formatHeader(chalk.bgHex('#8556D3').bold.white(` ${commands.LOGIN} `)))

      const strategy = await select(loginStrategy)
      try {
        if (strategy === 'login-with-token') {
          const userToken = await password({
            message: 'Please enter your token:',
            validate: (value: string) => {
              return value.length > 0
            },
          })

          const { user } = await loginWithToken(userToken, region)

          await addNetrcEntry({
            machineName: regionsDomain[region],
            login: user.email,
            password: userToken,
            region,
          })

          konsola.ok(`Successfully logged in with token`)
        }

        else {
          const userEmail = await input({
            message: 'Please enter your email address:',
            required: true,
            validate: (value: string) => {
              const emailRegex = /^[^\s@]+@[^\s@][^\s.@]*\.[^\s@]+$/
              return emailRegex.test(value)
            },
          })
          const userPassword = await password({
            message: 'Please enter your password:',
          })
          const userRegion = await select({
            message: 'Please select the region you would like to work in:',
            choices: Object.values(regions).map(region => ({
              name: regionNames[region],
              value: region,
            })),
            default: regions.EU,
          })
          const { otp_required } = await loginWithEmailAndPassword(userEmail, userPassword, userRegion as string)

          if (otp_required) {
            const otp = await input({
              message: 'We sent a code to your email / phone, please insert the authentication code:',
              required: true,
            })

            const { access_token } = await loginWithOtp(userEmail, userPassword, otp, userRegion as string)

            await addNetrcEntry({
              machineName: regionsDomain[userRegion],
              login: userEmail,
              password: access_token,
              region: userRegion,
            })

            konsola.ok(`Successfully logged in with email ${chalk.hex('#45bfb9')(userEmail)}`, true)
          }
        }
      }
      catch (error) {
        handleError(error as Error, true)
      }
    }
  })
