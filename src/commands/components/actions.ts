import { handleAPIError, handleFileSystemError } from '../../utils'
import type { RegionCode } from '../../constants'
import { join, parse } from 'node:path'
import { resolvePath, saveToFile } from '../../utils/filesystem'
import type { ReadComponentsOptions, SaveComponentsOptions, SpaceComponent, SpaceComponentGroup, SpaceComponentPreset, SpaceData } from './constants'
import { getStoryblokUrl } from '../../utils/api-routes'
import { customFetch, delay } from '../../utils/fetch'
import { readdir, readFile } from 'node:fs/promises'
import * as timers from 'node:timers/promises'

export const fetchComponents = async (space: string, token: string, region: RegionCode): Promise<SpaceComponent[] | undefined> => {
  try {
    const url = getStoryblokUrl(region)
    const response = await customFetch<{
      components: SpaceComponent[]
    }>(`${url}/spaces/${space}/components`, {
      headers: {
        Authorization: token,
      },
    })
    return response.components
  }
  catch (error) {
    handleAPIError('pull_components', error as Error)
  }
}

export const fetchComponent = async (space: string, componentName: string, token: string, region: RegionCode): Promise<SpaceComponent | undefined> => {
  try {
    const url = getStoryblokUrl(region)
    const response = await customFetch<{
      components: SpaceComponent[]
    }>(`${url}/spaces/${space}/components?search=${encodeURIComponent(componentName)}`, {
      headers: {
        Authorization: token,
      },
    })
    return response.components?.[0]
  }
  catch (error) {
    handleAPIError('pull_components', error as Error, `Failed to fetch component ${componentName}`)
  }
}

export const fetchComponentGroups = async (space: string, token: string, region: RegionCode): Promise<SpaceComponentGroup[] | undefined> => {
  try {
    const url = getStoryblokUrl(region)
    const response = await customFetch<{
      component_groups: SpaceComponentGroup[]
    }>(`${url}/spaces/${space}/component_groups`, {
      headers: {
        Authorization: token,
      },
    })
    return response.component_groups
  }
  catch (error) {
    handleAPIError('pull_component_groups', error as Error)
  }
}

export const fetchComponentPresets = async (space: string, token: string, region: RegionCode): Promise<SpaceComponentPreset[] | undefined> => {
  try {
    const url = getStoryblokUrl(region)
    const response = await customFetch<{
      presets: SpaceComponentPreset[]
    }>(`${url}/spaces/${space}/presets`, {
      headers: {
        Authorization: token,
      },
    })
    return response.presets
  }
  catch (error) {
    handleAPIError('pull_component_presets', error as Error)
  }
}

export const pushComponent = async (space: string, component: SpaceComponent, token: string, region: RegionCode): Promise<SpaceComponent | undefined> => {
  try {
    const url = getStoryblokUrl(region)

    const response = await customFetch<{
      component: SpaceComponent
    }>(`${url}/spaces/${space}/components`, {
      method: 'POST',
      headers: {
        Authorization: token,
      },
      body: JSON.stringify(component),
    })

    return response.component
  }
  catch (error) {
    await delay(2000)
    handleAPIError('push_component', error as Error, `Failed to push component ${component.name}`)
  }
}

export const fakePushComponent = async (component: SpaceComponent): Promise<SpaceComponent | undefined> => {
  await timers.setTimeout(Math.random() * 1000 + 1000)
  if (Math.random() < 0.5) {
    throw new Error('Random failure')
  }
  return component
}

export const saveComponentsToFiles = async (
  space: string,
  spaceData: SpaceData,
  options: SaveComponentsOptions,
) => {
  const { components, groups, presets } = spaceData
  const { filename = 'components', suffix, path, separateFiles } = options
  const resolvedPath = resolvePath(path, `components/${space}`)

  try {
    if (separateFiles) {
      // Save in separate files without nested structure
      for (const component of components) {
        const componentFilePath = join(resolvedPath, suffix ? `${component.name}.${suffix}.json` : `${component.name}.json`)
        await saveToFile(componentFilePath, JSON.stringify(component, null, 2))

        // Find and save associated presets
        const componentPresets = presets.filter(preset => preset.component_id === component.id)
        if (componentPresets.length > 0) {
          const presetsFilePath = join(resolvedPath, suffix ? `${component.name}.preset.${suffix}.json` : `${component.name}.preset.json`)
          await saveToFile(presetsFilePath, JSON.stringify(componentPresets, null, 2))
        }
        // Save groups
        const groupsFilePath = join(resolvedPath, suffix ? `groups.${suffix}.json` : `groups.json`)
        await saveToFile(groupsFilePath, JSON.stringify(groups, null, 2))
      }
      return
    }

    // Default to saving consolidated files
    const componentsFilePath = join(resolvedPath, suffix ? `${filename}.${suffix}.json` : `${filename}.json`)
    await saveToFile(componentsFilePath, JSON.stringify(components, null, 2))

    if (groups.length > 0) {
      const groupsFilePath = join(resolvedPath, suffix ? `groups.${suffix}.json` : `groups.json`)
      await saveToFile(groupsFilePath, JSON.stringify(groups, null, 2))
    }

    if (presets.length > 0) {
      const presetsFilePath = join(resolvedPath, suffix ? `presets.${suffix}.json` : `presets.json`)
      await saveToFile(presetsFilePath, JSON.stringify(presets, null, 2))
    }
  }
  catch (error) {
    handleFileSystemError('write', error as Error)
  }
}

export const readComponentsFiles = async (
  options: ReadComponentsOptions): Promise<SpaceData> => {
  const { filter, separateFiles, path, from } = options
  const resolvedPath = resolvePath(path, `components/${from}`)
  const regex = filter ? new RegExp(filter) : null

  const spaceData: SpaceData = {
    components: [],
    groups: [],
    presets: [],
  }
  // Add regex patterns to match file structures
  const componentsPattern = /^components(?:\..+)?\.json$/
  const groupsPattern = /^groups(?:\..+)?\.json$/
  const presetsPattern = /^presets(?:\..+)?\.json$/

  try {
    if (!separateFiles) {
      // Read from consolidated files
      const files = await readdir(resolvedPath, { recursive: !separateFiles })

      for (const file of files) {
        if (!file.endsWith('.json') || !componentsPattern.test(file) && !groupsPattern.test(file) && !presetsPattern.test(file)) { continue }

        try {
          const content = await readFile(join(resolvedPath, file), 'utf-8')
          const data = JSON.parse(content)

          if (componentsPattern.test(file)) {
            spaceData.components = regex
              ? data.filter((c: SpaceComponent) => regex.test(c.name))
              : data
          }
          else if (groupsPattern.test(file)) {
            spaceData.groups = data
          }
          else if (presetsPattern.test(file)) {
            spaceData.presets = data
          }
        }
        catch (error) {
          // Ignore file not found errors
          if ((error as NodeJS.ErrnoException).code !== 'ENOENT') {
            throw error
          }
        }
      }
      return spaceData
    }

    // Read from separate files
    const files = await readdir(resolvedPath, { recursive: true })

    // Then process files
    for (const file of files) {
      if (!file.endsWith('.json')) { continue }

      // Skip consolidated files in separate files mode
      if (/^(?:components|presets)\.json$/.test(file)) { continue }

      const { dir, name } = parse(file)
      const isPreset = /\.preset\.json$/.test(file)
      const baseName = name.replace(/\.preset$/, '').split('.')[0]

      // Skip if filter is set and doesn't match the base component name
      if (regex && !regex.test(baseName)) { continue }

      const content = await readFile(join(resolvedPath, file), 'utf-8')
      const data = JSON.parse(content)

      if (isPreset) {
        spaceData.presets.push(...data)
      }
      else if (groupsPattern.test(file)) {
        spaceData.groups = data
      }
      else {
        // Regular component file
        const component = Array.isArray(data) ? data[0] : data
        if (dir) {
          // If component is in a directory, find the corresponding group
          const group = spaceData.groups.find(g => g.name === dir.split('/').pop())
          if (group) {
            component.component_group_uuid = group.uuid
          }
        }
        spaceData.components.push(component)
      }
    }

    return spaceData
  }
  catch (error) {
    handleFileSystemError('read', error as Error)
    return spaceData
  }
}
