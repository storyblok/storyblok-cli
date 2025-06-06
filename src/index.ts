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
import { session } from './session';
import { fetchStories } from './commands/stories';

export * from './types/storyblok';

dotenv.config(); // This will load variables from .env into process.env
const program = getProgram();

konsola.br();
konsola.br();
konsola.title(` Storyblok CLI `, colorPalette.PRIMARY);

program.option('--verbose', 'Enable verbose output');
program.version(pkg.version, '-v, --vers', 'Output the current version');
program.helpOption('-h, --help', 'Display help for command');

program.on('command:*', () => {
  console.error(`Invalid command: ${program.args.join(' ')}`);
  konsola.br();
  program.help();
});

program.command('test')
  .description('Test the CLI')
  .action(async () => {
    const { state, initializeSession } = session();
    await initializeSession();

    const { password, region } = state;

    try {
      const result = await fetchStories('85047', password, region, {
        per_page: 100,
      });
      console.log(result?.length);
    }
    catch (error) {
      console.error(error);
    }
  });

try {
  program.parse(process.argv);
}
catch (error) {
  handleError(error as Error);
}
