const chalk = require('chalk')
const axios = require('axios')
const fs = require('fs')
const deleteComponent = require('./delete-component')

const isUrl = source => source.indexOf('http') === 0

/**
 * Get the data from a local or remote JSON file
 * @param {string} path the local path or remote url of the file
 * @returns {Promise<Object>} return the data from the source or an error
 */
const getDataFromPath = async (path) => {
  if (!path) {
    return {}
  }
  const sources = path.split(',')
  const isList = sources.length > 1

  try {
    if (isUrl(path)) {
      return (await axios.get(path)).data
    } else {
      if (!isList) return JSON.parse(fs.readFileSync(sources[0], 'utf8'))

      const data = []
      sources.forEach((source) => {
        data.push(JSON.parse(fs.readFileSync(source, 'utf8')))
      })
      return data
    }
  } catch (err) {
    console.error(`${chalk.red('X')} Can not load json file from ${path}`)
    return Promise.reject(err)
  }
}

/**
 * Creat an array based in the content parameter and the key provided
 * @param {object} content the data to create a list
 * @param {string} key key to serch in the content
 * @returns {Array} return the data from the source or an error
 */
const createContentList = (content, key) => {
  if (content[key]) return content[key]
  else if (Array.isArray(content)) return [...content]
  else return [content]
}

/**
 * Delete all components from your Space that occur in your Local JSON.
 * @param api {Object}
 * @param source {String}
 * @param reversed {Boolean} Or delete those components on your Space that do not appear in the JSON.
 * @param dryRun {Boolean}
 * @returns {Promise<void>}
 */
const deleteComponents = async (api, { source, reversed = false, dryRun = false }) => {
  try {
    const rawComponents = (await getDataFromPath(source)) || []
    const sourceComponents = createContentList(rawComponents, 'components')
    if (!reversed) {
      return deleteAllComponents(api, sourceComponents, dryRun)
    }
    const spaceComponents = await api.getComponents()
    return deleteComponentsReversed(api, sourceComponents, spaceComponents, dryRun)
  } catch (e) {
    console.error(`${chalk.red('X')} Can not delete with invalid json - please provide a valid json file`)
    return Promise.reject(new Error('Can not delete with invalid json - please provide a valid json file'))
  }
}

/**
 * Delete all given components
 * @param api {Object}
 * @param components {Object[]}
 * @param dryrun {Boolean}
 * @returns {Promise<void>}
 */
const deleteAllComponents = async (api, components, dryrun) => {
  for (const c of components) {
    await deleteComponentAndSkip(api, c, dryrun)
  }
}

/**
 * Delete all components which do not appear in components but in the space components
 * @param api {Object}
 * @param components {Object[]}
 * @param spaceComponents {Object[]}
 * @param dryrun {Boolean}
 * @returns {Promise<void>}
 */
const deleteComponentsReversed = async (api, components, spaceComponents, dryrun) => {
  const unifiedComps = components.concat([...spaceComponents])
  const toDelete = unifiedComps
    .filter((value, index, self) =>
      self.findIndex((o, i) => o.id === value.id && i !== index) < 0)
  console.log(chalk.blue('-') + ' Deleting all components which do not appear in the given source.')
  for (const c of toDelete) {
    await deleteComponentAndSkip(api, c, dryrun)
  }
}

const deleteComponentAndSkip = async (api, c, dryrun) => {
  try {
    return await deleteComponent(api, { comp: c.id, dryrun: dryrun })
  } catch (e) {
    console.log(chalk.red('-') + ' Error deleting component ' + chalk.blue(c.name) + '! Skipped...')
  }
}

module.exports = deleteComponents
