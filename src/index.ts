#!/usr/bin/env node
import chalk from 'chalk'
import dotenv from 'dotenv'

import { formatHeader, handleError, konsola } from './utils'
import { getProgram } from './program'
import './commands/login'
import './commands/logout'
import { APIError } from './utils/error/api-error'
import { loginWithEmailAndPassword, loginWithToken } from './commands/login/actions'

dotenv.config() // This will load variables from .env into process.env
const program = getProgram()
console.clear()
const introText = chalk.bgHex('#45bfb9').bold.black(` Storyblok CLI `)
const messageText = ` `
console.log(formatHeader(`
${introText} ${messageText}`))

program.option('-s, --space [value]', 'space ID')
program.option('-v, --verbose', 'Enable verbose output')

program.on('command:*', () => {
  console.error(`Invalid command: ${program.args.join(' ')}`)
  program.help()
  konsola.br() // Add a line break
})

program.command('test').action(async (options) => {
  konsola.title(`Test`, '#8556D3', 'Attempting a test...')
  konsola.error('This is an error message')
  /* try {
    // await loginWithEmailAndPassword('aw', 'passwrod', 'eu')
    await loginWithToken('WYSYDHYASDHSYD', 'eu')
  }
  catch (error) {
    handleError(error as Error)
  } */
})

/* console.log(`
${chalk.hex('#45bfb9')(' ─────╮')}
${chalk.hex('#45bfb9')('│     │')}
${chalk.hex('#45bfb9')('│')} ◠ ◡ ◠
${chalk.hex('#45bfb9')('|_  __|')}
${chalk.hex('#45bfb9')('  |/ ')}
`) */

try {
  program.parse(process.argv)
  konsola.br() // Add a line break
}
catch (error) {
  handleError(error as Error)
}
