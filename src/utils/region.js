import { getRegionBaseUrl } from '@storyblok/region-helper'

export const getRegionApiEndpoint = (region) => `${getRegionBaseUrl(region)}/v1/`

export default getRegionApiEndpoint