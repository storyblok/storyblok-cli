import fs from 'node:fs/promises'
import path from 'node:path'
import { handleError, konsola } from './utils'
import chalk from 'chalk'

export interface NetrcMachine {
  login: string
  password: string
  region: string
}

export const getNetrcFilePath = () => {
  const homeDirectory = process.env[
    process.platform.startsWith('win') ? 'USERPROFILE' : 'HOME'
  ] || process.cwd()

  return path.join(homeDirectory, '.netrc')
}

const readNetrcFileAsync = async (filePath: string) => {
  return await fs.readFile(filePath, 'utf8')
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
        machineData[key] = value
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
    try {
      await fs.access(filePath)
    }
    catch {
      console.warn(`.netrc file not found at path: ${filePath}`)
      return {}
    }

    const content = await readNetrcFileAsync(filePath)

    const machines = parseNetrcContent(content)
    return machines
  }
  catch (error) {
    console.error('Error reading or parsing .netrc file:', error)
    return {}
  }
}

export const getCredentialsForMachine = (machines: Record<string, NetrcMachine> = {}, machineName: string) => {
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
      await fs.access(filePath)
      // File exists, read and parse it
      const content = await fs.readFile(filePath, 'utf8')
      machines = parseNetrcContent(content)
    }
    catch {
      // File does not exist
      console.warn(`.netrc file not found at path: ${filePath}. A new file will be created.`)
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
    await fs.writeFile(filePath, newContent, {
      mode: 0o600, // Set file permissions
    })

    konsola.ok(`Successfully added/updated entry for machine ${machineName} in ${chalk.hex('#45bfb9')(filePath)}`, true)
  }
  catch (error: any) {
    handleError(new Error(`Error adding/updating entry for machine ${machineName} in .netrc file: ${error.message}`), true)
  }
}
