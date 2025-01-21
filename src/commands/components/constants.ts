import type { CommandOptions } from '../../types'

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

export interface SpaceComponentGroup {
  name: string
  id: number
  uuid: string
  parent_id: number
  parent_uuid: string
}

export interface SpaceComponentPreset {
  id: number
  name: string
  preset: Record<string, unknown>
  component_id: number
  space_id: number
  created_at: string
  updated_at: string
  image: string
  color: string
  icon: string
  description: string
}

export interface SpaceData {
  components: SpaceComponent[]
  groups: SpaceComponentGroup[]
  presets: SpaceComponentPreset[]
}
/**
 * Interface representing the options for the `pull-components` command.
 */
export interface PullComponentsOptions extends CommandOptions {

  /**
   * The filename to save the file as.
   * Defaults to `components`. The file will be saved as `<filename>.<space>.json`.
   * @default `components
   */
  filename?: string
  /**
   * The suffix to add to the filename.
   * Defaults to the space ID.
   * @default space
   */
  suffix?: string
  /**
   * Indicates whether to save each component to a separate file.
   * @default false
   */
  separateFiles?: boolean
}

export interface SaveComponentsOptions extends PullComponentsOptions {
  /**
   * The path to save the components file to.
   * Defaults to `.storyblok/components`.
   * @default `.storyblok/components`
   */
  path?: string
  /**
   * The regex filter to apply to the components before pushing.
   * @default `.*`
   */
  filter?: string
  /**
   * Indicates whether to read each component to a separate file.
   * @default false
   */
  separateFiles?: boolean

}

export interface PushComponentsOptions extends CommandOptions {

  /**
   * The regex filter to apply to the components before pushing.
   * @default `.*`
   */
  filter?: string
  /**
   * Indicates whether to save each component to a separate file.
   * @default false
   */
  separateFiles?: boolean
  /**
   * The source space id.
   */
  from?: string
}

export interface ReadComponentsOptions extends PushComponentsOptions {
  /**
   * The path to read the components file from.
   * Defaults to `.storyblok/components`.
   * @default `.storyblok/components`
   */
  path?: string
}
