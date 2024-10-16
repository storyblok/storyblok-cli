import { access, readFile, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { FileSystemError, handleFileSystemError, konsola } from './utils'
import chalk from 'chalk'
import type { RegionCode } from './constants'

export interface NetrcMachine {
  login: string
  password: string
  region: RegionCode
}

export const getNetrcFilePath = () => {
  const homeDirectory = process.env[
    process.platform.startsWith('win') ? 'USERPROFILE' : 'HOME'
  ] || process.cwd()

  return join(homeDirectory, '.netrc')
}

const readNetrcFileAsync = async (filePath: string) => {
  return await readFile(filePath, 'utf8')
}

const preprocessNetrcContent = (content: string) => {
  return content
    .split('\n')
    .map(line => line.split('#')[0].trim())
    .filter(line => line.length > 0)
    .join(' ')
}

const tokenizeNetrcContent = (content: string) => {
  return content
    .split(/\s+/)
    .filter(token => token.length > 0)
}

const parseNetrcTokens = (tokens: string[]) => {
  const machines: Record<string, NetrcMachine> = {}
  let i = 0

  while (i < tokens.length) {
    const token = tokens[i]

    if (token === 'machine' || token === 'default') {
      const machineName = token === 'default' ? 'default' : tokens[++i]
      const machineData: Partial<NetrcMachine> = {}
      i++

      while (
        i < tokens.length
        && tokens[i] !== 'machine'
        && tokens[i] !== 'default'
      ) {
        const key = tokens[i] as keyof NetrcMachine
        const value = tokens[++i]
        if (key === 'region') {
          machineData[key] = value as RegionCode
        }
        else {
          machineData[key] = value
        }
        i++
      }

      machines[machineName] = machineData as NetrcMachine
    }
    else {
      i++
    }
  }

  return machines
}

const parseNetrcContent = (content: string) => {
  const preprocessedContent = preprocessNetrcContent(content)
  const tokens = tokenizeNetrcContent(preprocessedContent)
  return parseNetrcTokens(tokens)
}

export const getNetrcCredentials = async (filePath: string = getNetrcFilePath()) => {
  try {
    await access(filePath)
  }
  catch {
    konsola.warn(`.netrc file not found at path: ${filePath}`)
    return {}
  }
  try {
    const content = await readNetrcFileAsync(filePath)

    const machines = parseNetrcContent(content)
    return machines
  }
  catch (error) {
    handleFileSystemError('read', error as NodeJS.ErrnoException)
    return {}
  }
}

export const getCredentialsForMachine = (
  machines: Record<string, NetrcMachine> = {},
  machineName?: string,
) => {
  if (machineName) {
    // Machine name provided
    if (machines[machineName]) {
      return machines[machineName]
    }
    else if (machines.default) {
      return machines.default
    }
    else {
      return null
    }
  }
  else {
    // No machine name provided
    if (machines.default) {
      return machines.default
    }
    else {
      const machineNames = Object.keys(machines)
      if (machineNames.length > 0) {
        return machines[machineNames[0]]
      }
      else {
        return null
      }
    }
  }
}

// Function to serialize machines object back into .netrc format
const serializeNetrcMachines = (machines: Record<string, NetrcMachine> = {}) => {
  let content = ''
  for (const [machineName, properties] of Object.entries(machines)) {
    content += `machine ${machineName}\n`
    for (const [key, value] of Object.entries(properties)) {
      content += `    ${key} ${value}\n`
    }
  }
  return content
}

// Function to add or update an entry in the .netrc file asynchronously
export const addNetrcEntry = async ({
  filePath = getNetrcFilePath(),
  machineName,
  login,
  password,
  region,
}: Record<string, string>) => {
  try {
    let machines: Record<string, NetrcMachine> = {}

    // Check if the file exists
    try {
      await access(filePath)
      // File exists, read and parse it
      const content = await readFile(filePath, 'utf8')
      machines = parseNetrcContent(content)
    }
    catch {
      // File does not exist
      konsola.warn(`.netrc file not found at path: ${filePath}. A new file will be created.`)
    }

    // Add or update the machine entry
    machines[machineName] = {
      login,
      password,
      region,
    } as NetrcMachine

    // Serialize machines back into .netrc format
    const newContent = serializeNetrcMachines(machines)

    // Write the updated content back to the .netrc file
    await writeFile(filePath, newContent, {
      mode: 0o600, // Set file permissions
    })

    konsola.ok(`Successfully added/updated entry for machine ${machineName} in ${chalk.hex('#45bfb9')(filePath)}`, true)
  }
  catch (error) {
    throw new FileSystemError('invalid_argument', 'write', error as NodeJS.ErrnoException, `Error adding/updating entry for machine ${machineName} in .netrc file`)
  }
}

// Function to remove an entry from the .netrc file asynchronously
export const removeNetrcEntry = async (
  filePath = getNetrcFilePath(),
  machineName?: string,
) => {
  try {
    let machines: Record<string, NetrcMachine> = {}

    // Check if the file exists
    try {
      await access(filePath)
      // File exists, read and parse it
      const content = await readFile(filePath, 'utf8')
      machines = parseNetrcContent(content)
    }
    catch {
      // File does not exist
      konsola.warn(`.netrc file not found at path: ${filePath}. No action taken.`)
      return
    }

    if (machineName) {
      // Remove the machine entry
      delete machines[machineName]
    }
    else {
      // Remove all machine entries
      machines = {}
    }

    // Serialize machines back into .netrc format
    const newContent = serializeNetrcMachines(machines)

    // Write the updated content back to the .netrc file
    await writeFile(filePath, newContent, {
      mode: 0o600, // Set file permissions
    })

    konsola.ok(`Successfully removed entries from ${chalk.hex('#45bfb9')(filePath)}`, true)
  }
  catch (error: unknown) {
    throw new Error(`Error removing entry for machine ${machineName} from .netrc file: ${(error as Error).message}`)
  }
}

export async function isAuthorized() {
  try {
    const machines = await getNetrcCredentials()
    // Check if there is any machine with a valid email and token
    for (const machine of Object.values(machines)) {
      if (machine.login && machine.password) {
        return true
      }
    }
    return false
  }
  catch (error: unknown) {
    handleFileSystemError('authorization_check', error as NodeJS.ErrnoException)
    return false
  }
}
