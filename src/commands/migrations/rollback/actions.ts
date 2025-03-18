import { join } from 'node:path';
import { resolvePath, saveToFile } from '../../../utils/filesystem';
import type { StoryContent } from '../../stories/constants';
import { readFile } from 'node:fs/promises';
import { updateStory } from '../../stories/actions';
import { Spinner } from '@topcli/spinner';
import chalk from 'chalk';
import { CommandError } from '../../../utils';
import { colorPalette } from '../../../constants';

export interface RollbackData {
  stories: Array<{
    storyId: number;
    name: string;
    content: StoryContent;
  }>;
}

/**
 * Save the rollback data for a migration
 * @param options - Options for saving rollback data
 * @param options.space - The space ID
 * @param options.path - Base path for saving rollback data
 * @param options.stories - Array of stories with their original content
 * @param options.migrationFile - Name of the migration file being applied
 */
export async function saveRollbackData({
  space,
  path,
  stories,
  migrationFile,
}: {
  space: string;
  path: string;
  stories: Array<{ id: number; name: string; content: StoryContent }>;
  migrationFile: string;
}): Promise<void> {
  // Create the rollback data structure
  const rollbackData: RollbackData = {
    stories: stories.map(story => ({
      storyId: story.id,
      name: story.name,
      content: story.content,
    })),
  };

  // Resolve the path for rollbacks
  const rollbacksPath = resolvePath(path, `migrations/${space}/rollbacks`);

  // The rollback file will have the same name as the migration file but with a timestamp suffix
  const timestamp = Date.now();
  const rollbackFileName = `${migrationFile.replace('.js', '')}.${timestamp}.json`;
  const rollbackFilePath = join(rollbacksPath, rollbackFileName);

  try {
    // Save the rollback data as JSON
    await saveToFile(
      rollbackFilePath,
      JSON.stringify(rollbackData, null, 2),
    );
  }
  catch (error) {
    // If the directory doesn't exist, create it and try again
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      // Create the directory structure
      const fs = await import('node:fs/promises');
      await fs.mkdir(rollbacksPath, { recursive: true });

      // Try saving again
      await saveToFile(
        rollbackFilePath,
        JSON.stringify(rollbackData, null, 2),
      );
    }
    else {
      throw error;
    }
  }
}

/**
 * Restore stories from a rollback file
 * @param options - Options for restoring stories
 * @param options.space - The space ID
 * @param options.path - Base path for rollback files
 * @param options.migrationFile - Name of the migration file to rollback
 * @param options.password - Password for authentication
 * @param options.region - Region code for API requests
 * @param options.verbose - Verbose mode flag
 */
export async function restoreFromRollback({
  space,
  path,
  migrationFile,
  password,
  region,
  verbose,
}: {
  space: string;
  path: string;
  migrationFile: string;
  password: string;
  region: 'eu' | 'us' | 'cn' | 'ca' | 'ap';
  verbose: boolean;
}): Promise<void> {
  try {
    // Construct the rollback file path
    const rollbacksPath = join(path || '.storyblok/migrations', space, 'rollbacks');
    const rollbackFilePath = join(rollbacksPath, migrationFile);

    // Read the rollback file
    const rollbackData: RollbackData = JSON.parse(await readFile(`${rollbackFilePath}.json`, 'utf-8'));

    // Restore each story to its original state
    for (const story of rollbackData.stories) {
      const spinner = new Spinner({ verbose }).start(`Restoring story ${chalk.hex(colorPalette.PRIMARY)(story.name || story.storyId)}...`);
      try {
        await updateStory(space, password, region, story.storyId, {
          story: {
            content: story.content as StoryContent,
            id: story.storyId,
            name: story.name,
          },
          force_update: '1',
        });
        spinner.succeed(`Restored story ${chalk.hex(colorPalette.PRIMARY)(story.name || story.storyId)}`);
      }
      catch (error) {
        spinner.failed(`Failed to restore story ${chalk.hex(colorPalette.PRIMARY)(story.name || story.storyId)}: ${(error as Error).message}`);
      }
    }
  }
  catch (error) {
    throw new CommandError(`Failed to rollback migration: ${(error as Error).message}`);
  }
}
