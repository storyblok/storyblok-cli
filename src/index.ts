#!/usr/bin/env node
import dotenv from 'dotenv';

import { handleError, konsola } from './utils';
import { getProgram } from './program';
import './commands/login';
import './commands/logout';
import './commands/user';
import './commands/components';
import './commands/languages';
import './commands/migrations';
import './commands/types';
import pkg from '../package.json';

import { colorPalette } from './constants';

export * from './types/storyblok';

dotenv.config(); // This will load variables from .env into process.env
const program = getProgram();

konsola.title(` Storyblok CLI `, colorPalette.PRIMARY);

program.option('--verbose', 'Enable verbose output');
program.version(pkg.version, '-v, --vers', 'output the current version');

program.on('command:*', () => {
  console.error(`Invalid command: ${program.args.join(' ')}`);
  konsola.br();
  program.help();
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
