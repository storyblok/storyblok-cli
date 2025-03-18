import { colorPalette, commands } from '../../../constants';
import { CommandError, handleError, konsola } from '../../../utils';
import { getProgram } from '../../../program';
import { migrationsCommand } from '../command';
import { session } from '../../../session';
import { restoreFromRollback } from './actions';
import chalk from 'chalk';

const program = getProgram();

migrationsCommand.command('rollback [migrationFile]')
  .description('Rollback a migration')
  .action(async (migrationFile: string) => {
    konsola.title(` ${commands.MIGRATIONS} `, colorPalette.MIGRATIONS, `Rolling back migration ${chalk.hex(colorPalette.MIGRATIONS)(migrationFile)}...`);

    const verbose = program.opts().verbose;

    // Command options
    const { space, path } = migrationsCommand.opts();

    const { state, initializeSession } = session();
    await initializeSession();

    if (!state.isLoggedIn || !state.password || !state.region) {
      handleError(new CommandError(`You are currently not logged in. Please login first to get your user info.`), verbose);
      return;
    }

    if (!space) {
      handleError(new CommandError(`Please provide the space as argument --space YOUR_SPACE_ID.`), verbose);
      return;
    }

    const { password, region } = state;

    try {
      await restoreFromRollback({
        space,
        path,
        migrationFile,
        password,
        region,
        verbose,
      });
    }
    catch (error) {
      handleError(new CommandError(`Failed to rollback migration: ${(error as Error).message}`), verbose);
    }
  });
