#!/usr/bin/env node
import chalk from 'chalk';
import dotenv from 'dotenv';

import { formatHeader, handleError, konsola } from './utils';
import { getProgram } from './program';
import './commands/login';
import './commands/logout';
import './commands/user';
import './commands/components';
import './commands/languages';
import './commands/migrations';
import './commands/types';

import { colorPalette } from './constants';

export * from './types/storyblok';

dotenv.config(); // This will load variables from .env into process.env
const program = getProgram();
console.clear();
const introText = chalk.bgHex(colorPalette.PRIMARY).bold(` Storyblok CLI `);
const messageText = ` `;
console.log(formatHeader(`
${introText} ${messageText}`));

program.option('-v, --verbose', 'Enable verbose output');

program.on('command:*', () => {
  console.error(`Invalid command: ${program.args.join(' ')}`);
  program.help();
  konsola.br(); // Add a line break
});

/* console.log(`
${chalk.hex(colorPalette.PRIMARY)(' ──────╮')}
${chalk.hex(colorPalette.PRIMARY)('│      │')}
${chalk.hex(colorPalette.PRIMARY)('│')}  ◠ ◡ ◠
${chalk.hex(colorPalette.PRIMARY)('╰─  ───╯')}
${chalk.hex(colorPalette.PRIMARY)('  |/ ')}
`); */

try {
  program.parse(process.argv);
}
catch (error) {
  handleError(error as Error);
}
