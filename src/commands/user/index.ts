import chalk from 'chalk';
import { colorPalette, commands } from '../../constants';
import { getProgram } from '../../program';
import { CommandError, handleError, isVitest, konsola } from '../../utils';
import { getUser } from './actions';
import { session } from '../../session';
import { Spinner } from '@topcli/spinner';
import { createManagementClient } from '../../api';

const program = getProgram(); // Get the shared singleton instance

export const userCommand = program
  .command(commands.USER)
  .description('Get the current user')
  .action(async () => {
    konsola.title(` ${commands.USER} `, colorPalette.USER);
    const { state, initializeSession } = session();
    await initializeSession();

    if (!state.isLoggedIn || !state.password || !state.region) {
      handleError(new CommandError(`You are currently not logged in. Please login first to get your user info.`));
      return;
    }

    createManagementClient({
      accessToken: state.password,
      region: state.region,
    });

    const spinner = new Spinner({
      verbose: !isVitest,
    }).start(`Fetching user info`);
    try {
      const user = await getUser();
      if (!user) {
        throw new Error('No user found');
      }
      spinner.succeed();
      konsola.ok(`Hi ${chalk.bold(user.friendly_name)}, you are currently logged in with ${chalk.hex(colorPalette.PRIMARY)(user.email)} on ${chalk.bold(state.region)} region`, true);
    }
    catch (error) {
      spinner.failed();
      handleError(error as Error, true);
    }
    konsola.br();
  });
