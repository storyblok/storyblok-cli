import chalk from 'chalk'
import { colorPalette, commands } from '../../constants'
import { session } from '../../session'
import { getProgram } from '../../program'
import { CommandError, handleError, konsola, removePropertyRecursively, removeUidRecursively } from '../../utils'
import { fetchComponent, fetchComponentGroups, fetchComponentInternalTags, fetchComponentPresets, fetchComponents, readComponentsFiles, saveComponentsToFiles, upsertComponent, upsertComponentGroup, upsertComponentInternalTag, upsertComponentPreset } from './actions'
import type { PullComponentsOptions, PushComponentsOptions, SpaceComponentInternalTag } from './constants'

import { Spinner } from '@topcli/spinner'

const program = getProgram() // Get the shared singleton instance

export const componentsCommand = program
  .command('components')
  .alias('comp')
  .description(`Manage your space's block schema`)
  .option('-s, --space <space>', 'space ID')
  .option('-p, --path <path>', 'path to save the file. Default is .storyblok/components')

componentsCommand
  .command('pull [componentName]')
  .option('-f, --filename <filename>', 'custom name to be used in file(s) name instead of space id')
  .option('--sf, --separate-files [value]', 'Argument to create a single file for each component')
  .option('--su, --suffix <suffix>', 'suffix to add to the file name (e.g. components.<suffix>.json). By default, the space ID is used.')
  .description(`Download your space's components schema as json. Optionally specify a component name to pull a single component.`)
  .action(async (componentName: string | undefined, options: PullComponentsOptions) => {
    konsola.title(` ${commands.COMPONENTS} `, colorPalette.COMPONENTS, componentName ? `Pulling component ${componentName}...` : 'Pulling components...')
    // Global options
    const verbose = program.opts().verbose
    // Command options
    const { space, path } = componentsCommand.opts()
    const { separateFiles, suffix, filename = 'components' } = options

    const { state, initializeSession } = session()
    await initializeSession()

    if (!state.isLoggedIn || !state.password || !state.region) {
      handleError(new CommandError(`You are currently not logged in. Please login first to get your user info.`), verbose)
      return
    }
    if (!space) {
      handleError(new CommandError(`Please provide the space as argument --space YOUR_SPACE_ID.`), verbose)
      return
    }

    const { password, region } = state

    try {
      // Fetch components groups
      const spinnerGroups = new Spinner()
        .start(`Fetching ${chalk.hex(colorPalette.COMPONENTS)('components groups')}`)

      const groups = await fetchComponentGroups(space, password, region)
      spinnerGroups.succeed(`${chalk.hex(colorPalette.COMPONENTS)('Groups')} - Completed in ${spinnerGroups.elapsedTime.toFixed(2)}ms`)

      // Fetch components presets
      const spinnerPresets = new Spinner()
        .start(`Fetching ${chalk.hex(colorPalette.COMPONENTS)('components presets')}`)

      const presets = await fetchComponentPresets(space, password, region)
      spinnerPresets.succeed(`${chalk.hex(colorPalette.COMPONENTS)('Presets')} - Completed in ${spinnerPresets.elapsedTime.toFixed(2)}ms`)

      // Fetch components internal tags
      const spinnerInternalTags = new Spinner()
        .start(`Fetching ${chalk.hex(colorPalette.COMPONENTS)('components internal tags')}`)

      const internalTags = await fetchComponentInternalTags(space, password, region)
      spinnerInternalTags.succeed(`${chalk.hex(colorPalette.COMPONENTS)('Tags')} - Completed in ${spinnerInternalTags.elapsedTime.toFixed(2)}ms`)

      // Save everything using the new structure
      let components
      const spinnerComponents = new Spinner()
        .start(`Fetching ${chalk.hex(colorPalette.COMPONENTS)('components')}`)

      if (componentName) {
        const component = await fetchComponent(space, componentName, password, region)
        if (!component) {
          konsola.warn(`No component found with name "${componentName}"`)
          return
        }
        components = [component]
      }
      else {
        components = await fetchComponents(space, password, region)
        if (!components || components.length === 0) {
          konsola.warn(`No components found in the space ${space}`)
          return
        }
      }
      spinnerComponents.succeed(`${chalk.hex(colorPalette.COMPONENTS)('Components')} - Completed in ${spinnerComponents.elapsedTime.toFixed(2)}ms`)
      await saveComponentsToFiles(
        space,
        { components, groups: groups || [], presets: presets || [], internalTags: internalTags || [] },
        { ...options, path, separateFiles: separateFiles || !!componentName },
      )
      konsola.br()
      if (separateFiles) {
        if (filename !== 'components') {
          konsola.warn(`The --filename option is ignored when using --separate-files`)
        }
        const filePath = path ? `${path}/` : `.storyblok/components/${space}/`

        konsola.ok(`Components downloaded successfully to ${chalk.hex(colorPalette.PRIMARY)(filePath)}`)
      }
      else if (componentName) {
        const fileName = suffix ? `${filename}.${suffix}.json` : `${componentName}.json`
        const filePath = path ? `${path}/${fileName}` : `.storyblok/components/${space}/${fileName}`
        konsola.ok(`Component ${chalk.hex(colorPalette.PRIMARY)(componentName)} downloaded successfully in ${chalk.hex(colorPalette.PRIMARY)(filePath)}`)
      }
      else {
        const fileName = suffix ? `${filename}.${suffix}.json` : `${filename}.json`
        const filePath = path ? `${path}/${fileName}` : `.storyblok/components/${space}/${fileName}`

        konsola.ok(`Components downloaded successfully to ${chalk.hex(colorPalette.PRIMARY)(filePath)}`)
      }
    }
    catch (error) {
      handleError(error as Error, verbose)
    }
  })

componentsCommand
  .command('push [componentName]')
  .description(`Push your space's components schema as json`)
  .option('-f, --from <from>', 'source space id')
  .option('--fi, --filter <filter>', 'glob filter to apply to the components before pushing')
  .option('--sf, --separate-files', 'Read from separate files instead of consolidated files')
  .action(async (componentName: string | undefined, options: PushComponentsOptions) => {
    konsola.title(` ${commands.COMPONENTS} `, colorPalette.COMPONENTS, componentName ? `Pushing component ${componentName}...` : 'Pushing components...')
    // Global options
    const verbose = program.opts().verbose
    const { space, path } = componentsCommand.opts()
    const { from, filter, separateFiles } = options

    const { state, initializeSession } = session()
    await initializeSession()

    if (!state.isLoggedIn || !state.password || !state.region) {
      handleError(new CommandError(`You are currently not logged in. Please login first to get your user info.`), verbose)
      return
    }
    if (!space) {
      handleError(new CommandError(`Please provide the target space as argument --space TARGET_SPACE_ID.`), verbose)
      return
    }

    if (!from) {
      // If no source space is provided, use the target space as source
      options.from = space
    }

    const { password, region } = state

    try {
      const spaceData = await readComponentsFiles({
        ...options,
        path,
      })

      if (!spaceData.components.length) {
        let message = 'No components found that meet the filter criteria. Please make sure you have pulled the components first and that the filter is correct.'
        if (options.separateFiles) {
          message = 'No components found that meet the filter criteria with the separate files. Please make sure you have pulled the components first and that the filter is correct.'
        }
        konsola.warn(message)
        return
      }

      const results = {
        successful: [] as string[],
        failed: [] as Array<{ name: string, error: unknown }>,
      }

      if (!separateFiles) {
        // If separate files are not used, we need to upsert the tags first
        await Promise.all(spaceData.internalTags.map(async (tag) => {
          const consolidatedSpinner = new Spinner()
          consolidatedSpinner.start('Upserting tags...')
          try {
            await upsertComponentInternalTag(space, tag, password, region)
            consolidatedSpinner.succeed(`Tag-> ${chalk.hex(colorPalette.COMPONENTS)(tag.name)} - Completed in ${consolidatedSpinner.elapsedTime.toFixed(2)}ms`)
          }
          catch (error) {
            consolidatedSpinner.failed(`Tag-> ${chalk.hex(colorPalette.COMPONENTS)(tag.name)} - Failed`)
            results.failed.push({ name: tag.name, error })
          }
        }))
        // Upsert groups
        await Promise.all(spaceData.groups.map(async (group) => {
          const consolidatedSpinner = new Spinner()
          consolidatedSpinner.start('Upserting groups...')
          try {
            await upsertComponentGroup(space, group, password, region)
            consolidatedSpinner.succeed(`Group-> ${chalk.hex(colorPalette.COMPONENTS)(group.name)} - Completed in ${consolidatedSpinner.elapsedTime.toFixed(2)}ms`)
          }
          catch (error) {
            consolidatedSpinner.failed(`Group-> ${chalk.hex(colorPalette.COMPONENTS)(group.name)} - Failed`)
            results.failed.push({ name: group.name, error })
          }
        }))
      }

      await Promise.all(spaceData.components.map(async (component) => {
        const spinner = new Spinner()
          .start(`${chalk.hex(colorPalette.COMPONENTS)(component.name)} - Pushing...`)
        try {
          const processedTags: { ids: string[], tags: SpaceComponentInternalTag[] } = { ids: [], tags: [] }

          if (component.internal_tag_ids?.length > 0 && separateFiles) {
            // spinner.text = `Pushing ${chalk.hex(colorPalette.COMPONENTS)(component.name)} internal tags...`
            // Process tags sequentially to ensure order
            await Promise.all(component.internal_tag_ids.map(async (tagId) => {
              const internalTagsSpinner = new Spinner()
              internalTagsSpinner.start(`Pushing ${chalk.hex(colorPalette.COMPONENTS)(component.name)} internal tags...`)
              const tag = spaceData.internalTags.find(tag => tag.id === Number(tagId))

              if (tag) {
                try {
                  const updatedTag = await upsertComponentInternalTag(space, tag, password, region)
                  if (updatedTag) {
                    processedTags.tags.push(updatedTag)
                    processedTags.ids.push(updatedTag.id.toString())
                    internalTagsSpinner.succeed(`Tag-> ${chalk.hex(colorPalette.COMPONENTS)(tag.name)} - Completed in ${internalTagsSpinner.elapsedTime.toFixed(2)}ms`)
                  }
                }
                catch (error) {
                  internalTagsSpinner.failed(`Tag-> ${chalk.hex(colorPalette.COMPONENTS)(tag.name)} - Failed`)
                  results.failed.push({ name: tag.name, error })
                }
              }
            }))
          }

          // Create a new component object with the processed tags
          const componentToUpdate = {
            ...component,
            internal_tag_ids: processedTags.ids,
            internal_tags_list: processedTags.tags,
          }
          const updatedComponent = await upsertComponent(space, componentToUpdate, password, region)
          if (updatedComponent) {
            const relatedPresets = spaceData.presets.filter(preset => preset.component_id === component.id)
            if (relatedPresets.length > 0) {
              await Promise.all(relatedPresets.map(async (preset) => {
                const presetSpinner = new Spinner()
                presetSpinner.start(`Upserting ${chalk.hex(colorPalette.COMPONENTS)(preset.name)}...`)
                try {
                  const presetToUpdate = {
                    name: preset.name,
                    preset: removePropertyRecursively(
                      removePropertyRecursively(preset.preset, '_uid'),
                      'component',
                    ),
                    component_id: updatedComponent.id,
                  }
                  await upsertComponentPreset(space, presetToUpdate, password, region)
                  presetSpinner.succeed(`Preset-> ${chalk.hex(colorPalette.COMPONENTS)(preset.name)} - Completed in ${presetSpinner.elapsedTime.toFixed(2)}ms`)
                }
                catch (error) {
                  presetSpinner.failed(`Preset-> ${chalk.hex(colorPalette.COMPONENTS)(preset.name)} - Failed`)
                  results.failed.push({ name: preset.name, error })
                }
              }))
            }
          }
          spinner.succeed(`Component-> ${chalk.hex(colorPalette.COMPONENTS)(component.name)} - Completed in ${spinner.elapsedTime.toFixed(2)}ms`)
          results.successful.push(component.name)
        }
        catch (error) {
          const spinnerFailedMessage = `Component-> ${chalk.hex(colorPalette.COMPONENTS)(component.name)} - Failed`
          spinner.failed(spinnerFailedMessage)
          results.failed.push({ name: component.name, error })
        }
      }))

      if (results.failed.length > 0) {
        if (!verbose) {
          konsola.br()
          konsola.info('For more information about the error, run the command with the `--verbose` flag')
        }
        else {
          results.failed.forEach((failed) => {
            handleError(failed.error as Error, verbose)
          })
        }
      }

      if (filter) {
        konsola.info(`Filter applied: ${filter}`)
      }
    }
    catch (error) {
      handleError(error as Error, verbose)
    }
  })
