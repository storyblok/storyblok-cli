#!/usr/bin/env node
import chalk from 'chalk'
import dotenv from 'dotenv'

import { formatHeader, handleError, konsola } from './utils'
import { getProgram } from './program'
import './commands/login'
import './commands/logout'
import './commands/user'
import './commands/pull-languages'

import { customFetch } from './utils/fetch'
import { getStoryblokUrl } from './utils/api-routes'
import { session } from './session'

dotenv.config() // This will load variables from .env into process.env
const program = getProgram()
console.clear()
const introText = chalk.bgHex('#45bfb9').bold.black(` Storyblok CLI `)
const messageText = ` `
console.log(formatHeader(`
${introText} ${messageText}`))

program.option('-v, --verbose', 'Enable verbose output')

program.on('command:*', () => {
  console.error(`Invalid command: ${program.args.join(' ')}`)
  program.help()
  konsola.br() // Add a line break
})

program.command('test').action(async () => {
  konsola.title(`Test`, '#8556D3', 'Attempting a test...')
  const verbose = program.opts().verbose
  try {
    const { state, initializeSession } = session()
    await initializeSession()
    const url = getStoryblokUrl()

    if (!state.password) {
      throw new Error('No password found')
    }

    const response = await customFetch(`${url}/spaces/2950170505/components`, {
      headers: {
        Authorization: state.password,
      },
    })
    console.log(response)
  }
  catch (error) {
    handleError(error as Error, verbose)
  }
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
