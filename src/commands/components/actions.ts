import { handleAPIError, handleFileSystemError } from '../../utils'
import type { RegionCode } from '../../constants'
import { join } from 'node:path'
import { resolvePath, saveToFile } from '../../utils/filesystem'
import type { SaveComponentsOptions, SpaceComponent, SpaceComponentGroup, SpaceComponentPreset, SpaceData } from './constants'
import { getStoryblokUrl } from '../../utils/api-routes'
import { customFetch } from '../../utils/fetch'

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
    handleAPIError('pull_components', error)
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
    handleAPIError('pull_components', error as Error)
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
          const presetsFilePath = join(resolvedPath, suffix ? `${component.name}.presets.${suffix}.json` : `${component.name}.presets.json`)
          await saveToFile(presetsFilePath, JSON.stringify(componentPresets, null, 2))
        }
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
