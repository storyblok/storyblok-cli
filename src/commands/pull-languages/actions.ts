import { access, constants, mkdir, writeFile } from 'node:fs/promises'
import { join, resolve } from 'node:path'

import { handleAPIError, handleFileSystemError } from '../../utils'
import { ofetch } from 'ofetch'
import { regionsDomain } from '../../constants'
import { session } from '../../session'
import { apiClient } from '../../api'

export interface SpaceInternationalizationOptions {
  languages: SpaceLanguage[]
  default_lang_name: string
}
export interface SpaceLanguage {
  code: string
  name: string
}

export const pullLanguages = async (space: string): Promise<SpaceInternationalizationOptions | undefined> => {
  try {
    const { client } = apiClient()
    if (!client) {
      throw new Error('Client not initialized')
    }

    const { state } = session()
    const response = await ofetch(`https://${regionsDomain[state.region]}/v1/spaces/${space}`, {
      headers: {
        Authorization: state.password,
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
      await mkdir(resolvedPath, { recursive: true })
    }

    return await writeFile(filePath, data, {
      mode: 0o600,
    })
  }
  catch (error) {
    handleFileSystemError('write', error as Error)
  }
}
