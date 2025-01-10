import { join } from 'node:path'
import { handleAPIError, handleFileSystemError } from '../../utils'
import type { FetchError } from '../../utils/fetch'
import { customFetch } from '../../utils/fetch'
import { resolvePath, saveToFile } from '../../utils/filesystem'
import type { PullLanguagesOptions } from './constants'
import type { RegionCode } from '../../constants'
import type { SpaceInternationalization } from '../../types'
import { getStoryblokUrl } from '../../utils/api-routes'

export const pullLanguages = async (space: string, token: string, region: RegionCode): Promise<SpaceInternationalization | undefined> => {
  try {
    const url = getStoryblokUrl(region)
    const response = await customFetch(`${url}/spaces/${space}`, {
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
    handleAPIError('pull_languages', error as FetchError)
  }
}

export const saveLanguagesToFile = async (space: string, internationalizationOptions: SpaceInternationalization, options: PullLanguagesOptions) => {
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
