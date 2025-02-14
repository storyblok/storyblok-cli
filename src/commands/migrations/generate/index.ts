import { Spinner } from '@topcli/spinner';
import chalk from 'chalk';

import type { MigrationsGenerateOptions } from './constants';
import { colorPalette, commands } from '../../../constants';
import { CommandError, handleError, isVitest, konsola } from '../../../utils';
import { session } from '../../../session';
import { migrationsCommand } from '../command';
import { fetchComponent } from '../../../commands/components';
import { generateMigration } from './actions';
import { getProgram } from '../../../program';

const program = getProgram();

migrationsCommand
  .command('generate [componentName]')
  .description('Generate a migration file')
  .option('--fi, --field <field>', 'field to migrate')
  .action(async (componentName: string | undefined, options: MigrationsGenerateOptions) => {
    konsola.title(` ${commands.MIGRATIONS} `, colorPalette.MIGRATIONS, componentName ? `Generating migration for component ${componentName}...` : 'Generating migrations...');
    // Global options
    const verbose = program.opts().verbose;

    // Command options
    const { space, path } = migrationsCommand.opts();

    const { field } = options;

    if (!componentName) {
      handleError(new CommandError(`Please provide the component name as argument --componentName YOUR_COMPONENT_NAME.`), verbose);
      return;
    }

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
      const spinner = new Spinner({
        verbose: !isVitest,
      }).start(`Generating migration for component ${componentName}...`);

      if (componentName && field) {
        const component = await fetchComponent(space, componentName, password, region);

        if (!component) {
          handleError(new CommandError(`No component found with name "${componentName}"`), verbose);
          return;
        }

        await generateMigration(space, path, component, field);

        spinner.succeed(`Migration generated for component ${chalk.hex(colorPalette.MIGRATIONS)(componentName)} and field ${chalk.hex(colorPalette.MIGRATIONS)(field)} - Completed in ${spinner.elapsedTime.toFixed(2)}ms`);

        const migrationPath = path ? `${path}/migrations/${space}/${component.name}-${field}.js` : `.storyblok/migrations/${space}/${component.name}-${field}.js`;
        konsola.ok(`You can find the migration file in ${chalk.hex(colorPalette.MIGRATIONS)(migrationPath)}`);
      }
    }
    catch (error) {
      handleError(error as Error, verbose);
    }
  });
