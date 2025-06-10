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
  handleWhitelists,
} from './operations';
import chalk from 'chalk';
import { mapiClient } from '../../../api';
import { fetchComponentGroups, fetchComponentInternalTags, fetchComponentPresets, fetchComponents } from '../actions';
import type { SpaceDataState } from '../constants';

const program = getProgram(); // Get the shared singleton instance

componentsCommand
  .command('push [componentName]')
  .description(`Push your space's components schema as json`)
  .option('-f, --from <from>', 'source space id')
  .option('--fi, --filter <filter>', 'glob filter to apply to the components before pushing')
  .option('--sf, --separate-files', 'Read from separate files instead of consolidated files')
  .option('--su, --suffix <suffix>', 'Suffix to add to the component name')
  .action(async (componentName: string | undefined, options: PushComponentsOptions) => {
    konsola.title(` ${commands.COMPONENTS} `, colorPalette.COMPONENTS, componentName ? `Pushing component ${componentName}...` : 'Pushing components...');
    console.time('perf: push components separate files');
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

    konsola.info(`Attempting to push components ${chalk.bold('from')} space ${chalk.hex(colorPalette.COMPONENTS)(options.from)} ${chalk.bold('to')} ${chalk.hex(colorPalette.COMPONENTS)(space)}`);
    konsola.br();

    const { password, region } = state;

    let requestCount = 0;

    mapiClient({
      token: password,
      region,
      onRequest: (request) => {
        requestCount++;
      },
    });

    try {
      const spaceState: SpaceDataState = {
        local: await readComponentsFiles({
          ...options,
          path,
          space,
        }),
        target: {
          components: new Map(),
          groups: new Map(),
          tags: new Map(),
          presets: new Map(),
        },
      };

      // Target space data
      const promises = [
        fetchComponents(space),
        fetchComponentGroups(space),
        fetchComponentPresets(space),
        fetchComponentInternalTags(space),
      ];
      const [components, groups, presets, internalTags] = await Promise.all(promises);

      components?.forEach((component) => {
        spaceState.target.components.set(component.name, component);
      });

      groups?.forEach((group) => {
        spaceState.target.groups.set(group.name, group);
      });
      presets?.forEach((preset) => {
        spaceState.target.presets.set(preset.name, preset);
      });
      internalTags?.forEach((tag) => {
        spaceState.target.tags.set(tag.name, tag);
      });

      // If componentName is provided, filter space data to only include related resources
      if (componentName) {
        spaceState.local = filterSpaceDataByComponent(spaceState.local, componentName);
        if (!spaceState.local.components.length) {
          handleError(new CommandError(`Component "${componentName}" not found.`), verbose);
          return;
        }
      }
      // If filter pattern is provided, filter space data to match the pattern
      else if (filter) {
        spaceState.local = filterSpaceDataByPattern(spaceState.local, filter);
        if (!spaceState.local.components.length) {
          handleError(new CommandError(`No components found matching pattern "${filter}".`), verbose);
          return;
        }
        konsola.info(`Filter applied: ${filter}`);
      }

      if (!spaceState.local.components.length) {
        konsola.warn('No components found. Please make sure you have pulled the components first.');
        return;
      }

      const results = {
        successful: [] as string[],
        failed: [] as Array<{ name: string; error: unknown }>,
      };

      // First, process whitelist dependencies
      const whitelistResults = await handleWhitelists(space, spaceState);
      results.successful.push(...whitelistResults.successful);
      results.failed.push(...whitelistResults.failed);

      // Then process remaining tags (skip those already processed in whitelists)
      const tagsResults = await handleTags(space, spaceState, whitelistResults.processedTagIds);
      results.successful.push(...tagsResults.successful);
      results.failed.push(...tagsResults.failed);

      // Then process remaining groups (skip those already processed in whitelists)
      const groupsResults = await handleComponentGroups(space, spaceState, whitelistResults.processedGroupUuids);
      results.successful.push(...groupsResults.successful);
      results.failed.push(...groupsResults.failed);

      // Finally process remaining components (skip those already processed in whitelists)
      const remainingComponents = spaceState.local.components.filter(
        component => !whitelistResults.processedComponentNames.has(component.name),
      );

      const componentsResults = await handleComponents({
        space,
        password,
        region,
        state: {
          ...spaceState,
          local: {
            ...spaceState.local,
            components: remainingComponents,
          },
        },
        /* spaceData: {
          ...spaceState.local,
          components: remainingComponents,
        }, */
        groupsUuidMap: new Map([...whitelistResults.groupsUuidMap, ...groupsResults.uuidMap]), // Merge both group maps
        tagsIdMaps: new Map([...whitelistResults.tagsIdMap, ...tagsResults.idMap]), // Merge both tag maps
        componentNameMap: whitelistResults.componentNameMap,
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
      console.log(`${results.successful.length} processed components`);
      console.log(`${requestCount} requests made`);
      console.timeEnd(`perf: push components separate files`);
    }
    catch (error) {
      handleError(error as Error, verbose);
    }
  });
