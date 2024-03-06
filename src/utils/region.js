const { getRegionBaseUrl } = require('@storyblok/region-helper')

const getRegionApiEndpoint = (region) => `${getRegionBaseUrl(region)}/v1/`

module.exports = {
  getRegionApiEndpoint
}
