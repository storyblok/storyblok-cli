import { ofetch } from 'ofetch'
import { handleAPIError, handleFileSystemError } from '../../utils'
import { regionsDomain } from '../../constants'
import { access, constants, mkdir, writeFile } from 'node:fs/promises'
import { join, resolve } from 'node:path'

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

export const saveComponentsToFiles = async (space: string, components: SpaceComponent[], options: ComponentsSaveOptions) => {
  const { path, filename } = options

  try {
    const data = JSON.stringify(components, null, 2)
    const resolvedPath = path ? resolve(process.cwd(), path) : process.cwd()
    const filePath = join(resolvedPath, filename ? `${filename}.json` : `components.${space}.json`)

    // Check if the path exists, and create it if it doesn't
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
  catch (error) {
    handleFileSystemError('write', error as Error)
  }
}
