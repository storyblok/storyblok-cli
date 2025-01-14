import { join, parse, resolve } from 'node:path'
import { mkdir, readFile as readFileImpl, writeFile } from 'node:fs/promises'
import { handleFileSystemError } from './error/filesystem-error'

export interface FileOptions {
  mode?: number
}

export const getStoryblokGlobalPath = () => {
  const homeDirectory = process.env[
    process.platform.startsWith('win') ? 'USERPROFILE' : 'HOME'
  ] || process.cwd()

  return join(homeDirectory, '.storyblok')
}

export const saveToFile = async (filePath: string, data: string, options: FileOptions) => {
  // Get the directory path
  const resolvedPath = parse(filePath).dir

  // Ensure the directory exists
  try {
    await mkdir(resolvedPath, { recursive: true })
  }
  catch (mkdirError) {
    handleFileSystemError('mkdir', mkdirError as Error)
    return // Exit early if the directory creation fails
  }

  // Write the file
  try {
    await writeFile(filePath, data, options)
  }
  catch (writeError) {
    handleFileSystemError('write', writeError as Error)
  }
}

export const readFile = async (filePath: string) => {
  try {
    return await readFileImpl(filePath, 'utf8')
  }
  catch (error) {
    handleFileSystemError('read', error as Error)
    return ''
  }
}

export const resolvePath = (path: string | undefined, folder: string) => path ? resolve(process.cwd(), path) : resolve(resolve(process.cwd(), '.storyblok'), folder)
