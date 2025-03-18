import { join } from 'node:path';
import { resolvePath, saveToFile } from '../../../utils/filesystem';
import type { StoryContent } from '../../stories/constants';

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
