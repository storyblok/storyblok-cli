import { join } from 'node:path'

import { handleAPIError, handleFileSystemError } from '../../utils'
import { ofetch } from 'ofetch'
import { regionsDomain } from '../../constants'
import { resolvePath, saveToFile } from '../../utils/filesystem'
import type { PullLanguagesOptions } from './constants'

export interface SpaceInternationalizationOptions {
  languages: SpaceLanguage[]
  default_lang_name: string
}
export interface SpaceLanguage {
  code: string
  name: string
}

export const pullLanguages = async (space: string, token: string, region: string): Promise<SpaceInternationalizationOptions | undefined> => {
  try {
    const response = await ofetch(`https://${regionsDomain[region]}/v1/spaces/${space}`, {
      headers: {
        Authorization: token,
      },
    })
    return {
      default_lang_name: response.space.default_lang_name,
      languages: response.space.languages,
    }
  }
  catch (error) {
    handleAPIError('pull_languages', error as Error)
  }
}

export const saveLanguagesToFile = async (space: string, internationalizationOptions: SpaceInternationalizationOptions, options: PullLanguagesOptions) => {
  try {
    const { filename = 'languages', suffix = space, path } = options
    const data = JSON.stringify(internationalizationOptions, null, 2)
    const name = `${filename}.${suffix}.json`
    const resolvedPath = resolvePath(path, 'languages')
    const filePath = join(resolvedPath, name)

    await saveToFile(filePath, data)
  }
  catch (error) {
    handleFileSystemError('write', error as Error)
  }
}
