import { access, constants, mkdir, writeFile } from 'node:fs/promises'
import { join, resolve } from 'node:path'

import { handleAPIError, handleFileSystemError } from '../../utils'
import { ofetch } from 'ofetch'
import { regionsDomain } from '../../constants'

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

export const saveLanguagesToFile = async (space: string, internationalizationOptions: SpaceInternationalizationOptions, path?: string) => {
  try {
    const data = JSON.stringify(internationalizationOptions, null, 2)
    const filename = `languages.${space}.json`
    const resolvedPath = path ? resolve(process.cwd(), path) : process.cwd()
    const filePath = join(resolvedPath, filename)

    // Check if the path exists, and create it if it doesn't
    try {
      await access(resolvedPath, constants.F_OK)
    }
    catch {
      try {
        await mkdir(resolvedPath, { recursive: true })
      }
      catch (mkdirError) {
        handleFileSystemError('mkdir', mkdirError as Error)
        return // Exit early if the directory creation fails
      }
    }

    try {
      await writeFile(filePath, data, { mode: 0o600 })
    }
    catch (writeError) {
      handleFileSystemError('write', writeError as Error)
    }
  }
  catch (error) {
    handleFileSystemError('write', error as Error)
  }
}
