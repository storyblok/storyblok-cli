import type { PushComponentsOptions } from './constants';

import { colorPalette, commands } from '../../../constants';
import { getProgram } from '../../../program';
import { CommandError, handleError, konsola } from '../../../utils';
import { session } from '../../../session';
import { readComponentsFiles } from './actions';
import { componentsCommand } from '../command';
import {
  filterSpaceDataByComponent,
  filterSpaceDataByPattern,
  handleComponentGroups,
  handleComponents,
  handleTags,
} from './operations';

const program = getProgram(); // Get the shared singleton instance

componentsCommand
  .command('push [componentName]')
  .description(`Push your space's components schema as json`)
  .option('-f, --from <from>', 'source space id')
  .option('--fi, --filter <filter>', 'glob filter to apply to the components before pushing')
  .option('--sf, --separate-files', 'Read from separate files instead of consolidated files')
  .action(async (componentName: string | undefined, options: PushComponentsOptions) => {
    konsola.title(` ${commands.COMPONENTS} `, colorPalette.COMPONENTS, componentName ? `Pushing component ${componentName}...` : 'Pushing components...');
    // Global options

    const verbose = program.opts().verbose;
    const { space, path } = componentsCommand.opts();

    const { from, filter } = options;

    // Check if the user is logged in
    const { state, initializeSession } = session();
    await initializeSession();

    if (!state.isLoggedIn || !state.password || !state.region) {
      handleError(new CommandError(`You are currently not logged in. Please login first to get your user info.`), verbose);
      return;
    }

    // Check if the space is provided
    if (!space) {
      handleError(new CommandError(`Please provide the target space as argument --space TARGET_SPACE_ID.`), verbose);
      return;
    }

    if (!from) {
      // If no source space is provided, use the target space as source
      options.from = space;
    }

    const { password, region } = state;

    try {
      let spaceData = await readComponentsFiles({
        ...options,
        path,
      });

      // If componentName is provided, filter space data to only include related resources
      if (componentName) {
        spaceData = filterSpaceDataByComponent(spaceData, componentName);
        if (!spaceData.components.length) {
          konsola.error(`Component "${componentName}" not found.`);
          return;
        }
      }
      // If filter pattern is provided, filter space data to match the pattern
      else if (filter) {
        spaceData = filterSpaceDataByPattern(spaceData, filter);
        if (!spaceData.components.length) {
          konsola.error(`No components found matching pattern "${filter}".`);
          return;
        }
        konsola.info(`Filter applied: ${filter}`);
      }

      if (!spaceData.components.length) {
        konsola.warn('No components found. Please make sure you have pulled the components first.');
        return;
      }

      const results = {
        successful: [] as string[],
        failed: [] as Array<{ name: string; error: unknown }>,
      };

      const tagsResults = await handleTags(space, password, region, spaceData.internalTags);
      results.successful.push(...tagsResults.successful);
      results.failed.push(...tagsResults.failed);

      const groupsResults = await handleComponentGroups(space, password, region, spaceData.groups);
      results.successful.push(...groupsResults.successful);
      results.failed.push(...groupsResults.failed);

      const componentsResults = await handleComponents({
        space,
        password,
        region,
        spaceData,
        groupsUuidMap: groupsResults.uuidMap,
        tagsIdMaps: tagsResults.idMap,
      });
      results.successful.push(...componentsResults.successful);
      results.failed.push(...componentsResults.failed);

      if (results.failed.length > 0) {
        if (!verbose) {
          konsola.br();
          konsola.info('For more information about the error, run the command with the `--verbose` flag');
        }
        else {
          results.failed.forEach((failed) => {
            handleError(failed.error as Error, verbose);
          });
        }
      }
    }
    catch (error) {
      handleError(error as Error, verbose);
    }
  });
