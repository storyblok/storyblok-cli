const chalk = require('chalk')
const saveFileFactory = require('../utils/save-file-factory')

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

/**
 * @method pullComponents
 * @param  {Object} api
 * @param  {Object} options { space: Number, singleFile: Boolean, path: String }
 * @return {Promise<Object>}
 */
const pullComponents = async (api, options) => {
  const { space, singleFile, path } = options

  try {
    const componentGroups = await api.getComponentGroups()

    const components = await api.getComponents()

    const presets = await api.getPresets()

    components.forEach(component => {
      const groupUuid = component.component_group_uuid
      if (groupUuid) {
        const group = getNameFromComponentGroups(componentGroups, groupUuid)
        component.component_group_name = group
      }
    })

    if (singleFile) {
      for (const comp in components) {
        const compFileName = `${components[comp].name}-${space}.json`
        const data = JSON.stringify(components[comp], null, 2)
        saveFileFactory(compFileName, data, path)
      }
      console.log(`${chalk.green('✓')} We've saved your components in the file`)

      if (!presets.length) return

      for (const preset in presets) {
        const presetFileName = `${presets[preset].name}-${space}.json`
        const data = JSON.stringify(presets[preset], null, 2)
        saveFileFactory(presetFileName, data, path)
      }
      console.log(`${chalk.green('✓')} We've saved your components in the file`)
      return
    }

    const file = `components.${space}.json`
    const data = JSON.stringify({ components }, null, 2)

    console.log(`${chalk.green('✓')} We've saved your components in the file: ${file}`)

    saveFileFactory(file, data, path)

    if (!presets.length) return

    const presetsFile = `presets.${space}.json`
    const presetsData = JSON.stringify({ presets }, null, 2)

    console.log(`${chalk.green('✓')} We've saved your presets in the file: ${presetsFile}`)

    saveFileFactory(presetsFile, presetsData, path)
  } catch (e) {
    console.error(`${chalk.red('X')} An error ocurred in pull-components task when load components data`)
    return Promise.reject(new Error(e))
  }
}

module.exports = pullComponents
