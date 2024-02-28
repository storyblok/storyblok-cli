const { getRegionBaseUrl } = require('@storyblok/region-helper')

const getManagementBaseURLByRegion = (region) => `${getRegionBaseUrl(region)}/v1/`

module.exports = {
  getManagementBaseURLByRegion
}
