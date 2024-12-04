import { ofetch } from 'ofetch'
import { handleAPIError, handleFileSystemError } from '../../utils'
import { regionsDomain } from '../../constants'
import { join } from 'node:path'
import { resolvePath, saveToFile } from '../../utils/filesystem'
import type { PullComponentsOptions } from './constants'

export interface SpaceComponent {
  name: string
  display_name: string
  created_at: string
  updated_at: string
  id: number
  schema: Record<string, unknown>
  image?: string
  preview_field?: string
  is_root?: boolean
  is_nestable?: boolean
  preview_tmpl?: string
  all_presets?: Record<string, unknown>
  preset_id?: number
  real_name?: string
  component_group_uuid?: string
  color: null
  internal_tags_list: string[]
  interntal_tags_ids: number[]
  content_type_asset_preview?: string
}

export interface ComponentsSaveOptions {
  path?: string
  filename?: string
  separateFiles?: boolean
  suffix?: string
}

export const pullComponents = async (space: string, token: string, region: string): Promise<SpaceComponent[] | undefined> => {
  try {
    const response = await ofetch(`https://${regionsDomain[region]}/v1/spaces/${space}/components`, {
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

export const saveComponentsToFiles = async (space: string, components: SpaceComponent[], options: PullComponentsOptions) => {
  const { filename = 'components', suffix = space, path } = options

  try {
    const data = JSON.stringify(components, null, 2)
    const resolvedPath = resolvePath(path, 'components')

    if (options.separateFiles) {
      for (const component of components) {
        try {
          const filePath = join(resolvedPath, `${component.name}.${suffix}.json`)
          await saveToFile(filePath, JSON.stringify(component, null, 2))
        }
        catch (error) {
          handleFileSystemError('write', error as Error)
        }
      }
      return
    }

    // Default to saving all components to a single file
    const name = `${filename}.${suffix}.json`
    const filePath = join(resolvedPath, name)

    // Check if the path exists, and create it if it doesn't
    await saveToFile(filePath, data)
  }
  catch (error) {
    handleFileSystemError('write', error as Error)
  }
}
