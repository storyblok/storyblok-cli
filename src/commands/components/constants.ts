import type { CommandOptions } from '../../types'

/**
 * Interface representing the options for the `pull-components` command.
 */
export interface PullComponentsOptions extends CommandOptions {
  /**
   * The path to save the components file to.
   * Defaults to `.storyblok/components`.
   * @default `.storyblok/components`
   */
  path?: string
  /**
   * The space ID.
   * @required true
   */
  space: string
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
