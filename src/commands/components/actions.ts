import { handleAPIError, handleFileSystemError } from '../../utils'
import type { RegionCode } from '../../constants'
import { join, parse } from 'node:path'
import { resolvePath, saveToFile } from '../../utils/filesystem'
import type { ReadComponentsOptions, SaveComponentsOptions, SpaceComponent, SpaceComponentGroup, SpaceComponentInternalTag, SpaceComponentPreset, SpaceData } from './constants'
import { getStoryblokUrl } from '../../utils/api-routes'
import { customFetch } from '../../utils/fetch'
import { readdir, readFile } from 'node:fs/promises'
import * as timers from 'node:timers/promises'
import { APIError } from '../../utils/error/api-error'

// Component actions
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
    handleAPIError('push_component', error as Error, `Failed to push component ${component.name}`)
  }
}

export const fakePushComponent = async (component: SpaceComponent, ratio: number = 0.5): Promise<SpaceComponent | undefined> => {
  await timers.setTimeout(Math.random() * 1000 + 1000)
  if (Math.random() < ratio) {
    throw new Error('Random failure')
  }
  return component
}

// Component group actions
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

export const pushComponentGroup = async (space: string, componentGroup: SpaceComponentGroup, token: string, region: RegionCode): Promise<SpaceComponentGroup | undefined> => {
  try {
    const url = getStoryblokUrl(region)
    const response = await customFetch<{
      component_group: SpaceComponentGroup
    }>(`${url}/spaces/${space}/component_groups`, {
      method: 'POST',
      headers: {
        Authorization: token,
      },
      body: JSON.stringify(componentGroup),
    })
    return response.component_group
  }
  catch (error) {
    handleAPIError('push_component_group', error as Error, `Failed to push component group ${componentGroup.name}`)
  }
}

export const fakePushComponentGroup = async (componentGroup: SpaceComponentGroup, ratio: number = 0.5): Promise<SpaceComponentGroup | undefined> => {
  await timers.setTimeout(Math.random() * 1000 + 1000)
  if (Math.random() < ratio) {
    throw new Error('Random failure')
  }
  return componentGroup
}

// Component preset actions
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

export const pushComponentPreset = async (space: string, componentPreset: SpaceComponentPreset, token: string, region: RegionCode): Promise<SpaceComponentPreset | undefined> => {
  try {
    const url = getStoryblokUrl(region)
    const response = await customFetch<{
      preset: SpaceComponentPreset
    }>(`${url}/spaces/${space}/presets`, {
      method: 'POST',
      headers: {
        Authorization: token,
      },
      body: JSON.stringify(componentPreset),
    })
    return response.preset
  }
  catch (error) {
    handleAPIError('push_component_preset', error as Error, `Failed to push component preset ${componentPreset.name}`)
  }
}

export const fakePushComponentPreset = async (componentPreset: SpaceComponentPreset, ratio: number = 0.5): Promise<SpaceComponentPreset | undefined> => {
  await timers.setTimeout(Math.random() * 1000 + 1000)
  if (Math.random() < ratio) {
    throw new Error('Random failure')
  }
  return componentPreset
}

// Component internal tags
export const fetchComponentInternalTags = async (space: string, token: string, region: RegionCode): Promise<SpaceComponentInternalTag[] | undefined> => {
  try {
    const url = getStoryblokUrl(region)
    const response = await customFetch<{
      internal_tags: SpaceComponentInternalTag[]
    }>(`${url}/spaces/${space}/internal_tags`, {
      headers: {
        Authorization: token,
      },
    })
    return response.internal_tags
  }
  catch (error) {
    handleAPIError('pull_component_internal_tags', error as Error)
  }
}

export const pushComponentInternalTag = async (space: string, componentInternalTag: SpaceComponentInternalTag, token: string, region: RegionCode): Promise<SpaceComponentInternalTag | undefined> => {
  try {
    const url = getStoryblokUrl(region)
    const response = await customFetch<{
      internal_tag: SpaceComponentInternalTag
    }>(`${url}/spaces/${space}/internal_tags`, {
      method: 'POST',
      headers: {
        Authorization: token,
      },
      body: JSON.stringify(componentInternalTag),
    })
    return response.internal_tag
  }
  catch (error) {
    handleAPIError('push_component_internal_tag', error as Error, `Failed to push component internal tag ${componentInternalTag.name}`)
  }
}

export const fakePushComponentInternalTag = async (componentInternalTag: SpaceComponentInternalTag, ratio: number = 0.5): Promise<SpaceComponentInternalTag | undefined> => {
  await timers.setTimeout(Math.random() * 1000 + 1000)
  if (Math.random() < ratio) {
    throw new Error('Random failure')
  }
  return componentInternalTag
}

// Filesystem actions
export const saveComponentsToFiles = async (
  space: string,
  spaceData: SpaceData,
  options: SaveComponentsOptions,
) => {
  const { components, groups, presets, internalTags } = spaceData
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
        // Always save groups in a consolidated file
        const groupsFilePath = join(resolvedPath, suffix ? `groups.${suffix}.json` : `groups.json`)
        await saveToFile(groupsFilePath, JSON.stringify(groups, null, 2))

        // Always save internal tags in a consolidated file
        const internalTagsFilePath = join(resolvedPath, suffix ? `tags.${suffix}.json` : `tags.json`)
        await saveToFile(internalTagsFilePath, JSON.stringify(internalTags, null, 2))
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

    if (internalTags.length > 0) {
      const internalTagsFilePath = join(resolvedPath, suffix ? `tags.${suffix}.json` : `tags.json`)
      await saveToFile(internalTagsFilePath, JSON.stringify(internalTags, null, 2))
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
    internalTags: [],
  }
  // Add regex patterns to match file structures
  const componentsPattern = /^components(?:\..+)?\.json$/
  const groupsPattern = /^groups(?:\..+)?\.json$/
  const presetsPattern = /^presets(?:\..+)?\.json$/
  const internalTagsPattern = /^tags(?:\..+)?\.json$/
  try {
    if (!separateFiles) {
      // Read from consolidated files
      const files = await readdir(resolvedPath, { recursive: !separateFiles })

      for (const file of files) {
        if (!file.endsWith('.json') || !componentsPattern.test(file) && !groupsPattern.test(file) && !presetsPattern.test(file) && !internalTagsPattern.test(file)) { continue }

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
          else if (internalTagsPattern.test(file)) {
            spaceData.internalTags = data
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
      else if (internalTagsPattern.test(file)) {
        spaceData.internalTags = data
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

export const updateComponent = async (space: string, componentId: number, component: SpaceComponent, token: string, region: RegionCode): Promise<SpaceComponent | undefined> => {
  try {
    const url = getStoryblokUrl(region)
    const response = await customFetch<{
      component: SpaceComponent
    }>(`${url}/spaces/${space}/components/${componentId}`, {
      method: 'PUT',
      headers: {
        Authorization: token,
      },
      body: JSON.stringify(component),
    })
    return response.component
  }
  catch (error) {
    handleAPIError('update_component', error as Error, `Failed to update component ${component.name}`)
  }
}

export const updateComponentInternalTag = async (space: string, tagId: number, componentInternalTag: SpaceComponentInternalTag, token: string, region: RegionCode): Promise<SpaceComponentInternalTag | undefined> => {
  try {
    const url = getStoryblokUrl(region)
    const response = await customFetch<{
      internal_tag: SpaceComponentInternalTag
    }>(`${url}/spaces/${space}/internal_tags/${tagId}`, {
      method: 'PUT',
      headers: {
        Authorization: token,
      },
      body: JSON.stringify(componentInternalTag),
    })
    return response.internal_tag
  }
  catch (error) {
    handleAPIError('update_component_internal_tag', error as Error, `Failed to update component internal tag ${componentInternalTag.name}`)
  }
}

export const upsertComponent = async (space: string, component: SpaceComponent, token: string, region: RegionCode): Promise<SpaceComponent | undefined> => {
  try {
    return await pushComponent(space, component, token, region)
  }
  catch (error) {
    if (error instanceof APIError && error.code === 422) {
      if (error.response?.data?.name && error.response?.data?.name[0] === 'has already been taken') {
        // Find existing component by name
        const existingComponent = await fetchComponent(space, component.name, token, region)
        if (existingComponent) {
          // Update existing component
          return await updateComponent(space, existingComponent.id, component, token, region)
        }
      }
    }
    throw error
  }
}

export const upsertComponentInternalTag = async (space: string, tag: SpaceComponentInternalTag, token: string, region: RegionCode): Promise<SpaceComponentInternalTag | undefined> => {
  try {
    return await pushComponentInternalTag(space, tag, token, region)
  }
  catch (error) {
    if (error instanceof APIError && error.code === 422) {
      if (error.response?.data?.name && error.response?.data?.name[0] === 'has already been taken') {
        // Find existing tag by name
        const existingTags = await fetchComponentInternalTags(space, token, region)
        const existingTag = existingTags?.find(t => t.name === tag.name)
        if (existingTag) {
          // Update existing tag
          return await updateComponentInternalTag(space, existingTag.id, tag, token, region)
        }
      }
    }
    throw error
  }
}
