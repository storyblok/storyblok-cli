const chalk = require('chalk')
const creds = require('../utils/creds')

/**
 * @method listSpaces
 * @param api - Pass the api instance as a parameter
 * @return {Promise}
 */

const listSpaces = async (api) => {
  const { region } = creds.get()
  const isChinaEnv = region === 'cn'
  const regionOptions = {
    eu: 'Europe',
    us: 'United States'
  }
  console.log()
  console.log(chalk.green('✓') + ' Loading spaces...')

  if (!api) {
    console.log(chalk.red('X') + 'Api instance is required to make the request')
    return []
  }

  if (isChinaEnv) {
    const spaces = await api.getAllSpaces(region)
      .then(res => res)
      .catch(err => Promise.reject(err))

    if (!spaces) {
      console.log(chalk.red('X') + ' No spaces were found for this user ')
      return []
    }
    console.log(chalk.blue(' -') + ' Spaces From China')

    spaces.map(space => {
      console.log(`    ${space.name} (id: ${space.id})`)
    })
  } else {
    const spacesList = []
    for (const key in regionOptions) {
      spacesList.push(await api.getAllSpaces(key)
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
      console.log(`${chalk.blue(' -')} Spaces From ${regionOptions[region.key]}:`)
      region.res.forEach((space) => {
        console.log(`    ${space.name} (id: ${space.id})`)
      })
    })
  }
}

module.exports = listSpaces
