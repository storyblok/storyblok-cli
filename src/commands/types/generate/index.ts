import { colorPalette, commands } from '../../../constants';
import { CommandError, handleError, isVitest, konsola } from '../../../utils';
import { getProgram } from '../../../program';
import { session } from '../../../session';
import { Spinner } from '@topcli/spinner';
import { readComponentsFiles } from '../../components/push/actions';
import type { GenerateTypesOptions } from './constants';
import type { ReadComponentsOptions } from '../../components/push/constants';
import { typesCommand } from '../command';
import { generateTypes, saveTypesToFile } from './actions';

const program = getProgram();

typesCommand
  .command('generate [componentName]')
  .description('Generate types d.ts for your component schemas')
  .option('--fi, --filter <filter>', 'glob filter to apply to the components before generating types')
  .option('--sf, --separate-files', '')
  .action(async (componentName: string | undefined, options: GenerateTypesOptions) => {
    konsola.title(` ${commands.TYPES} `, colorPalette.TYPES, componentName ? `Generating types for component ${componentName}...` : 'Generating types...');
    // Global options
    const verbose = program.opts().verbose;

    // Command options
    const { space, path } = typesCommand.opts();

    console.log(typesCommand.opts());

    // const { filter, separateFiles } = options;

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

    const spinnerText = componentName ? `Generating types for component ${componentName}...` : 'Generating types...';
    const spinner = new Spinner({
      verbose: !isVitest,
    }).start(spinnerText);

    try {
      const spaceData = await readComponentsFiles({
        ...options as ReadComponentsOptions,
        from: space,
        path,
      });

      const typedefString = await generateTypes(spaceData.components, options);

      await saveTypesToFile(space, typedefString, options);

      spinner.succeed(`Successfully generated types for component ${componentName}`);
    }
    catch (error) {
      spinner.failed(`Failed to generate types for component ${componentName}`);
      handleError(error as Error, verbose);
    }
  });
