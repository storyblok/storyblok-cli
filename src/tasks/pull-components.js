import chalk from 'chalk'
import saveFileFactory from '../utils/save-file-factory'

/**
 * @method getNameFromComponentGroups
 * @param  {Array<Object>} groups
 * @param  {String} uuid
 * @return {String}
 */
const getNameFromComponentGroups = (groups, uuid) => {
  const exists = groups.filter(group => group.uuid === uuid)

  if (exists.length) {
    return exists[0].name
  }

  return ''
}

const resolveDatasourceOptions = async (api, components) => {
  const datasources = await api.getDatasources()

  for (const datasource of datasources) {
    const datasourceEntries = await api.getDatasourceEntries(datasource.id)
    datasource.entries = datasourceEntries
  }

  return components.map(component => {
    const schema = component.schema

    for (const field in schema) {
      if (schema[field].source === 'internal' && schema[field].datasource_slug) {
        const datasource = datasources.find(ds => ds.slug === schema[field].datasource_slug)

        if (datasource) {
          schema[field].options = datasource.entries.map(entry => ({ value: entry.value, name: entry.name }))
        }
      }
    }

    return component
  })
}

/**
 * @method pullComponents
 * @param  {Object} api
 * @param  {Object} options { fileName: string, separateFiles: Boolean, path: String, resolveDatasources: Boolean }
 * @return {Promise<Object>}
 */
const pullComponents = async (api, options) => {
  const { fileName, separateFiles, path, prefixPresetsNames, resolveDatasources } = options

  try {
    const componentGroups = await api.getComponentGroups()

    let components = await api.getComponents()

    const presets = await api.getPresets()

    if (resolveDatasources) {
      components = await resolveDatasourceOptions(api, components)
    }

    components.forEach(component => {
      const groupUuid = component.component_group_uuid
      if (groupUuid) {
        const group = getNameFromComponentGroups(componentGroups, groupUuid)
        component.component_group_name = group
      }
    })

    if (separateFiles) {
      for (const comp in components) {
        const compFileName = `${components[comp].name}-${fileName}.json`
        const data = JSON.stringify(components[comp], null, 2)
        saveFileFactory(compFileName, data, path)
      }
      console.log(`${chalk.green('✓')} We've saved your components in files with the names of each component`)

      if (presets.length === 0) return

      for (const preset in presets) {
        const presetFileName = `${prefixPresetsNames ? `${presets[preset].preset.component}-` : ""}${presets[preset].name}-${fileName}.json`
        const data = JSON.stringify(presets[preset], null, 2)
        saveFileFactory(presetFileName, data, path)
      }
      console.log(`${chalk.green('✓')} We've saved your presets in files with the names of each preset`)
      return
    }

    const file = `components.${fileName}.json`
    const data = JSON.stringify({ components, component_groups: componentGroups }, null, 2)

    console.log(`${chalk.green('✓')} We've saved your components in the file: ${file}`)

    saveFileFactory(file, data, path)

    if (presets.length === 0) return

    const presetsFile = `presets.${fileName}.json`
    const presetsData = JSON.stringify({ presets }, null, 2)

    console.log(`${chalk.green('✓')} We've saved your presets in the file: ${presetsFile}`)

    saveFileFactory(presetsFile, presetsData, path)
  } catch (e) {
    console.error(`${chalk.red('X')} An error ocurred in pull-components task when load components data`)
    return Promise.reject(new Error(e))
  }
}

export default pullComponents
