import { join } from 'node:path';
import { handleAPIError, handleFileSystemError } from '../../utils';
import { resolvePath, saveToFile } from '../../utils/filesystem';
import type { PullLanguagesOptions } from './constants';
import type { SpaceInternationalization } from '../../types';
import { managementClient } from '../../api';

export const fetchLanguages = async (space: string): Promise<SpaceInternationalization | undefined> => {
  try {
    const { get } = managementClient();
    const response = await get<{
      space: SpaceInternationalization;
    }>(`/spaces/${space}`);

    return {
      default_lang_name: response.space.default_lang_name,
      languages: response.space.languages,
    };
  }
  catch (error) {
    handleAPIError('pull_languages', error);
  }
};

export const saveLanguagesToFile = async (space: string, internationalizationOptions: SpaceInternationalization, options: PullLanguagesOptions) => {
  try {
    const { filename = 'languages', suffix, path } = options;
    const data = JSON.stringify(internationalizationOptions, null, 2);
    const name = suffix ? `${filename}.${suffix}.json` : `${filename}.json`;
    const resolvedPath = resolvePath(path, `languages/${space}/`);
    const filePath = join(resolvedPath, name);

    await saveToFile(filePath, data);
  }
  catch (error) {
    handleFileSystemError('write', error as Error);
  }
};
