#!/usr/bin/env node
import chalk from 'chalk'
import { __dirname, formatHeader, handleError } from './utils'
import { getProgram } from './program'
import './commands/login'

const program = getProgram()
console.clear()
const introText = chalk.bgHex('#45bfb9').bold.black(` Storyblok CLI `)
const messageText = ` Starting Blok machine... `
console.log(formatHeader(`
${introText} ${messageText}`))


program.on('command:*', () => {
  console.error(`Invalid command: ${program.args.join(' ')}`)
  program.help()
})

try {
  program.parse(process.argv)
}
catch (error) {
  handleError(error as Error)
}

