import { access } from 'node:fs/promises'
import { join } from 'node:path'
import { FileSystemError, handleFileSystemError, konsola } from './utils'
import chalk from 'chalk'
import { colorPalette } from './constants'
import { getStoryblokGlobalPath, readFile, saveToFile } from './utils/filesystem'

export const getCredentials = async (filePath = join(getStoryblokGlobalPath(), 'credentials.json')) => {
  try {
    await access(filePath)
    const content = await readFile(filePath)
    return JSON.parse(content)
  }
  catch (error) {
    handleFileSystemError('read', error as NodeJS.ErrnoException)
    return {}
  }
}

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
  }

  try {
    await saveToFile(filePath, JSON.stringify(credentials, null, 2), { mode: 0o600 })

    konsola.ok(`Successfully added/updated entry for machine ${machineName} in ${chalk.hex(colorPalette.PRIMARY)(filePath)}`, true)
  }
  catch (error) {
    throw new FileSystemError('invalid_argument', 'write', error as NodeJS.ErrnoException, `Error adding/updating entry for machine ${machineName} in credentials.json file`)
  }
}

export const removeCredentials = async (machineName: string, filepath: string = getStoryblokGlobalPath()) => {
  const filePath = join(filepath, 'credentials.json')
  const credentials = await getCredentials(filePath)

  if (credentials[machineName]) {
    delete credentials[machineName]

    try {
      await saveToFile(filePath, JSON.stringify(credentials, null, 2), { mode: 0o600 })

      konsola.ok(`Successfully removed entry for machine ${machineName} from ${chalk.hex(colorPalette.PRIMARY)(filePath)}`, true)
    }
    catch (error) {
      throw new FileSystemError('invalid_argument', 'write', error as NodeJS.ErrnoException, `Error removing entry for machine ${machineName} from credentials.json file`)
    }
  }
  else {
    konsola.warn(`No entry found for machine ${machineName} in ${chalk.hex(colorPalette.PRIMARY)(filePath)}`, true)
  }
}
