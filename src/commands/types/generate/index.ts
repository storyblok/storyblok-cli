import { colorPalette, commands } from '../../../constants';
import { CommandError, handleError, isVitest, konsola } from '../../../utils';
import { getProgram } from '../../../program';
import { session } from '../../../session';
import { Spinner } from '@topcli/spinner';
import { readComponentsFiles } from '../../components/push/actions';
import type { GenerateTypesOptions } from './constants';
import type { ReadComponentsOptions } from '../../components/push/constants';
import { typesCommand } from '../command';
import { generateStoryblokTypes, generateTypes, saveTypesToFile } from './actions';

const program = getProgram();

typesCommand
  .command('generate')
  .description('Generate types d.ts for your component schemas')
  .option('--sf, --separate-files', '')
  .option('--strict', 'strict mode, no loose typing')
  .option('--type-prefix <prefix>', 'prefix to be prepended to all generated component type names')
  .option('--suffix <suffix>', 'Components suffix')
  .option('--custom-fields-parser <path>', 'Path to the parser file for Custom Field Types')
  .option('--compiler-options <options>', 'path to the compiler options from json-schema-to-typescript')
  .action(async (options: GenerateTypesOptions) => {
    konsola.title(` ${commands.TYPES} `, colorPalette.TYPES, 'Generating types...');
    // Global options
    const verbose = program.opts().verbose;

    // Command options
    const { space, path } = typesCommand.opts();

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

    const spinnerText = 'Generating types...';
    const spinner = new Spinner({
      verbose: !isVitest,
    }).start(spinnerText);

    try {
      const spaceData = await readComponentsFiles({
        ...options as ReadComponentsOptions,
        from: space,
        path,
      });

      await generateStoryblokTypes({
        filename: options.filename,
        path: options.path,
      });

      const typedefString = await generateTypes(spaceData, options);

      if (typedefString) {
        await saveTypesToFile(space, typedefString, options);
      }

      spinner.succeed();
      konsola.ok(`Successfully generated types for space ${space}`);
    }
    catch (error) {
      spinner.failed(`Failed to generate types for space ${space}`);
      handleError(error as Error, verbose);
    }
  });
