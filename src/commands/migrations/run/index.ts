import { Spinner } from '@topcli/spinner';
import { getProgram } from '../../../program';
import { colorPalette, commands } from '../../../constants';
import { CommandError, handleError, isVitest, konsola } from '../../../utils';
import { session } from '../../../session';
import type { MigrationsRunOptions } from './constants';
import { migrationsCommand } from '../command';
import { fetchStoriesByComponent, fetchStory, updateStory } from '../../stories/actions';
import { readMigrationFiles } from './actions';
import { handleMigrations, summarizeMigrationResults } from './operations';
import type { StoryContent } from '../../stories/constants';
import chalk from 'chalk';

const program = getProgram();

migrationsCommand.command('run [componentName]')
  .description('Run migrations')
  .option('--fi, --filter <filter>', 'glob filter to apply to the components before pushing')

  .option('-d, --dry-run', 'Preview changes without applying them to Storyblok')
  .action(async (componentName: string | undefined, options: MigrationsRunOptions) => {
    konsola.title(` ${commands.MIGRATIONS} `, colorPalette.MIGRATIONS, componentName ? `Running migrations for component ${componentName}...` : 'Running migrations...');

    // Global options
    const verbose = program.opts().verbose;

    const { filter, dryRun = false } = options;

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
      const spinner = new Spinner({
        verbose: !isVitest,
      }).start(`Fetching migration files and stories...`);

      // Read migration files
      const migrationFiles = await readMigrationFiles({
        space,
        path,
        filter,
      });

      if (migrationFiles.length === 0) {
        spinner.failed(`No migration files found for space "${space}"${filter ? ` matching filter "${filter}"` : ''}.`);
        return;
      }

      // Filter migrations based on component name if provided
      const filteredMigrations = componentName
        ? migrationFiles.filter((file) => {
            // Match any migration file that starts with the component name and is followed by either
            // the end of the filename or a dot
            return file.name.match(new RegExp(`^${componentName}(\\..*)?\.js$`));
          })
        : migrationFiles;

      if (filteredMigrations.length === 0) {
        spinner.failed(`No migration files found${componentName ? ` for component "${componentName}"` : ''}${filter ? ` matching filter "${filter}"` : ''} in space "${space}".`);
        return;
      }

      // Spinner doesn't have update method, so we'll stop and start a new one
      spinner.succeed(`Found ${filteredMigrations.length} migration files.`);
      const storiesSpinner = new Spinner({ verbose: !isVitest }).start(`Fetching stories...`);

      // Fetch stories using the base component name
      const stories = await fetchStoriesByComponent(space, password, region, componentName || '');

      if (!stories || stories.length === 0) {
        storiesSpinner.failed(`No stories found${componentName ? ` for component "${componentName}"` : ''}.`);
        return;
      }

      // Fetch full content for each story
      const storiesWithContent = await Promise.all(stories.map(async (story) => {
        const fullStory = await fetchStory(space, password, region, story.id.toString());
        return {
          id: story.id,
          name: story.name,
          content: fullStory?.content,
        };
      }));

      // Filter out stories with no content
      const validStories = storiesWithContent.filter(story => story.content);

      // Spinner doesn't have update method, so we'll stop and start a new one
      storiesSpinner.succeed(`Fetched ${validStories.length} stories with related content.`);

      // Process migrations using the new operations module
      const processingSpinner = new Spinner({ verbose: !isVitest }).start(`Processing migrations...`);
      processingSpinner.succeed(`Starting to process ${validStories.length} stories with ${filteredMigrations.length} migrations...`);

      const migrationResults = await handleMigrations({
        migrationFiles: filteredMigrations,
        stories: validStories,
        space,
        path,
        componentName,
        password,
        region,
      });

      // Summarize the results
      summarizeMigrationResults(migrationResults);

      // Update the stories in Storyblok with the modified content
      if (migrationResults.successful.length > 0 && !dryRun) {
        const updateSpinner = new Spinner({ verbose: !isVitest }).start(`Updating stories in Storyblok...`);

        // Group successful migrations by story ID to get the latest content for each story
        const storiesByIdMap = new Map<number, { id: number; name: string; content: StoryContent }>();

        // Get the latest content for each story (in case multiple migrations were applied)
        migrationResults.successful.forEach((result) => {
          storiesByIdMap.set(result.storyId, {
            id: result.storyId,
            name: result.name,
            content: result.content,
          });
        });

        const storiesToUpdate = Array.from(storiesByIdMap.values());

        if (storiesToUpdate.length === 0) {
          updateSpinner.succeed(`No stories need to be updated in Storyblok.`);
        }
        else {
          updateSpinner.succeed(`Found ${storiesToUpdate.length} stories to update.`);

          // Update each story
          let successCount = 0;
          let failCount = 0;

          for (const story of storiesToUpdate) {
            const storySpinner = new Spinner({ verbose: !isVitest }).start(`Updating story ${chalk.hex(colorPalette.PRIMARY)(story.name || story.id.toString())}...`);

            try {
              const updatedStory = await updateStory(space, password, region, story.id, story.content);

              if (updatedStory) {
                successCount++;
                storySpinner.succeed(`Updated story ${chalk.hex(colorPalette.PRIMARY)(story.name || story.id.toString())} - Completed in ${storySpinner.elapsedTime.toFixed(2)}ms`);
              }
              else {
                failCount++;
                storySpinner.failed(`Failed to update story ${chalk.hex(colorPalette.PRIMARY)(story.name || story.id.toString())}`);
              }
            }
            catch (error) {
              failCount++;
              storySpinner.failed(`Failed to update story ${chalk.hex(colorPalette.PRIMARY)(story.name || story.id.toString())}: ${(error as Error).message}`);
            }
          }

          // Show summary
          if (failCount > 0) {
            konsola.warn(`Updated ${successCount} stories successfully, ${failCount} failed.`);
          }
          else if (successCount > 0) {
            konsola.ok(`Successfully updated ${successCount} stories in Storyblok.`, true);
          }
        }
      }
      else if (dryRun) {
        konsola.info(`Dry run mode: No stories were updated in Storyblok.`);
      }
      else if (migrationResults.successful.length === 0) {
        konsola.info(`No stories were modified by the migrations.`);
      }
    }
    catch (error) {
      handleError(error as Error, verbose);
    }
  });
