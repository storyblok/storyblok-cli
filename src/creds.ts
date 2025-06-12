import { access } from 'node:fs/promises';
import { join } from 'node:path';
import { FileSystemError, handleFileSystemError, konsola } from './utils';
import chalk from 'chalk';
import type { RegionCode } from './constants';
import { colorPalette, regionsDomain } from './constants';
import { getStoryblokGlobalPath, readFile, saveToFile } from './utils/filesystem';
import type { StoryblokCredentials } from './types';

function isCredentialKey(k: string): k is keyof StoryblokCredentials {
  return k === 'login' || k === 'password' || k === 'region';
}

export const getCredentials = async (filePath = join(getStoryblokGlobalPath(), 'credentials.json')): Promise<StoryblokCredentials | null> => {
  try {
    await access(filePath);
    const content = await readFile(filePath);
    const parsedContent = JSON.parse(content);

    // Return null if the parsed content is an empty object
    if (Object.keys(parsedContent).length === 0) {
      return null;
    }

    return parsedContent;
  }
  catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      // File doesn't exist, create it with empty credentials
      await saveToFile(filePath, JSON.stringify({}, null, 2), { mode: 0o600 });
      return null;
    }
    handleFileSystemError('read', error as NodeJS.ErrnoException);
    return null;
  }
};

export const addCredentials = async ({
  filePath = join(getStoryblokGlobalPath(), 'credentials.json'),
  machineName,
  login,
  password,
  region,
}: Record<string, string>) => {
  const credentials = {
    ...await getCredentials(filePath),
    [machineName]: {
      login,
      password,
      region,
    },
  };

  try {
    await saveToFile(filePath, JSON.stringify(credentials, null, 2), { mode: 0o600 });
  }
  catch (error) {
    throw new FileSystemError('invalid_argument', 'write', error as NodeJS.ErrnoException, `Error adding/updating entry for machine ${machineName} in credentials.json file`);
  }
};

export const removeCredentials = async (region: RegionCode, filepath: string = getStoryblokGlobalPath()) => {
  const filePath = join(filepath, 'credentials.json');
  const credentials = await getCredentials(filePath);
  const machineName = regionsDomain[region] || 'api.storyblok.com';

  if (isCredentialKey(machineName) && credentials) {
    delete credentials[machineName];

    try {
      await saveToFile(filePath, JSON.stringify(credentials, null, 2), { mode: 0o600 });

      konsola.ok(`Successfully removed entry for machine ${machineName} from ${chalk.hex(colorPalette.PRIMARY)(filePath)}`, true);
    }
    catch (error) {
      throw new FileSystemError('invalid_argument', 'write', error as NodeJS.ErrnoException, `Error removing entry for machine ${machineName} from credentials.json file`);
    }
  }
  else {
    konsola.warn(`No entry found for machine ${machineName} in ${chalk.hex(colorPalette.PRIMARY)(filePath)}`, true);
  }
};

export const removeAllCredentials = async (filepath: string = getStoryblokGlobalPath()) => {
  const filePath = join(filepath, 'credentials.json');
  await saveToFile(filePath, JSON.stringify({}, null, 2), { mode: 0o600 });
};
