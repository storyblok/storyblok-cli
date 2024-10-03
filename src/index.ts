#!/usr/bin/env node
import chalk from 'chalk'
import dotenv from 'dotenv'

import { formatHeader, handleError } from './utils'
import { getProgram } from './program'
import './commands/login'
import './commands/logout'
import { session } from './session'

dotenv.config() // This will load variables from .env into process.env
const program = getProgram()
console.clear()
const introText = chalk.bgHex('#45bfb9').bold.black(` Storyblok CLI `)
const messageText = ` `
console.log(formatHeader(`
${introText} ${messageText}`))

program.option('-s, --space [value]', 'space ID')

program.on('command:*', () => {
  console.error(`Invalid command: ${program.args.join(' ')}`)
  program.help()
})

program.command('test').action(async () => {
  const { state, initializeSession } = session()

  await initializeSession()

  console.log(state)
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
}
catch (error) {
  handleError(error as Error)
}
