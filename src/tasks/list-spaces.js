const chalk = require('chalk')
const { ALL_REGIONS, getRegionName, CN_CODE } = require('@storyblok/region-helper')
/**
 * @method listSpaces
 * @param api - Pass the api instance as a parameter
 * @return {Promise}
 */

// TODO: test
const listSpaces = async (api, currentRegion) => {
  const isChinaEnv = currentRegion === CN_CODE

  console.log()
  console.log(chalk.green('✓') + ' Loading spaces...')

  if (!api) {
    console.log(chalk.red('X') + 'Api instance is required to make the request')
    return []
  }

  if (isChinaEnv) {
    const spaces = await api.getAllSpacesByRegion(currentRegion)
      .then(res => res)
      .catch(err => Promise.reject(err))

    if (!spaces) {
      console.log(chalk.red('X') + ' No spaces were found for this user ')
      return []
    }
    console.log(chalk.blue(' -') + ' Spaces From China region:')

    spaces.map(space => {
      console.log(`    ${space.name} (id: ${space.id})`)
    })
    return spaces
  } else {
    const spacesList = []
    for (const key of ALL_REGIONS) {
      if (key === CN_CODE) continue
      spacesList.push(await api.getAllSpacesByRegion(key)
        .then((res) => {
          return {
            key,
            res
          }
        })
        .catch(err => Promise.reject(err)))
    }
    if (!spacesList) {
      console.log(chalk.red('X') + ' No spaces were found for this user ')
      return []
    }
    spacesList.forEach(region => {
      console.log()
      console.log(`${chalk.blue(' -')} Spaces From ${getRegionName(region.key)} region:`)
      region.res.forEach((space) => {
        console.log(`    ${space.name} (id: ${space.id})`)
      })
    })
    return spacesList
  }
}

module.exports = listSpaces
