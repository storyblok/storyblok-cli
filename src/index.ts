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

import { createMapiClient } from './api';
import { session } from './session';
// import { Spinner } from '@topcli/spinner';
import pLimit from 'p-limit';

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

program
  .command('test')
  .option('--limit <number>', 'Limit the number of concurrent requests', '10')
  .description('Test the CLI')
  .action(async (options) => {
    console.log('Testing the CLI...');
    console.time('Test');
    // Check if the user is logged in
    const { state, initializeSession } = session();
    await initializeSession();

    const { password, region } = state;

    const limit = pLimit(Number(options.limit));

    const client = createMapiClient({
      token: password,
      url: 'http://localhost:2599/api',
      verbose: true,
    });

    const results = {
      success: [],
      failed: [],
    };

    try {
      const promises = Array.from({ length: 10 }).map(async (_value, index) => {
        /* const spinner = new Spinner({
          verbose: true,
        }); */

        try {
          /* spinner.start(`Fetching user ${index}...`); */
          const { data, attempt } = await limit(() => client.get(`users/${index}`));
          /*  spinner.succeed(`${data.name} - Attempt ${attempt}`); */
          results.success.push({ data, attempt });

          const tags = Array.from({ length: 6 }).map(async (_value, internalIndex) => {
            const { data, attempt } = await limit(() => client.get(`tags/${index}${internalIndex}`));
            results.success.push({ data, attempt });
          });

          await Promise.all(tags);
        }
        catch (error) {
          /*  spinner.failed(); */
          results.failed.push(`users/${index} - ${error.response.status}`);
        }
      });
      await Promise.all(promises);
    }
    catch (error) {
      console.log(error);
    }

    console.log(results);
    console.timeEnd('Test');
  });

try {
  program.parse(process.argv);
}
catch (error) {
  handleError(error as Error);
}
