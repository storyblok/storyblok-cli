import { removeAllCredentials } from '../../creds';
import { commands } from '../../constants';
import { getProgram } from '../../program';
import { handleError, konsola } from '../../utils';
import { session } from '../../session';

const program = getProgram(); // Get the shared singleton instance

export const logoutCommand = program
  .command(commands.LOGOUT)
  .description('Logout from the Storyblok CLI')
  .action(async () => {
    const verbose = program.opts().verbose;
    try {
      const { state, initializeSession } = session();
      await initializeSession();
      if (!state.isLoggedIn || !state.password || !state.region) {
        konsola.ok(`You are already logged out. If you want to login, please use the login command.`);
        return;
      }
      await removeAllCredentials();

      konsola.ok(`Successfully logged out`);
    }
    catch (error) {
      handleError(error as Error, verbose);
    }
  });
