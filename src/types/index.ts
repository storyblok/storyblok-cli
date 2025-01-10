/**
 * Interface representing the default options for a CLI command.
 */
export interface CommandOptions {
  /**
   * Indicates whether verbose output is enabled.
   */
  verbose: boolean
}

/**
 * Interface representing a language in Storyblok
 */
export interface Language {
  name: string
  code: string
  fallback_code?: string
  ai_translation_code: string | null
}

export interface SpaceInternationalization {
  languages: Language[]
  default_lang_name: string
}
