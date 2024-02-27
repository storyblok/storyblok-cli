const { getRegionUrl } = require('@storyblok/region-helper')

const getManagementBaseURLByRegion = (region) => `${getRegionUrl(region)}/v1/`

module.exports = {
  getManagementBaseURLByRegion
}
