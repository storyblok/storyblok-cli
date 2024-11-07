import { parse } from 'node:path'
import { access, constants, mkdir, writeFile } from 'node:fs/promises'
import { handleFileSystemError } from './error/filesystem-error'

export const saveToFile = async (filePath: string, data: string) => {
  // Check if the path exists, and create it if it doesn't
  const resolvedPath = parse(filePath).dir
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
