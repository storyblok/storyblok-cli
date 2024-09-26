export const commands = {
  LOGIN: 'login',
}

export const regions = {
  EU: 'eu',
  US: 'us',
  CN: 'cn',
  CA: 'ca',
  AP: 'ap',
}

export const regionsDomain = {
  eu: 'api.storyblok.com',
  us: 'api-us.storyblok.com',
  cn: 'app.storyblokchina.cn',
  ca: 'api-ca.storyblok.com',
  ap: 'api-ap.storyblok.com',
}

export const managementApiRegions = {
  eu: 'mapi.storyblok.com',
  us: 'mapi-us.storyblok.com',
  cn: 'mapi.storyblokchina.cn',
  ca: 'mapi-ca.storyblok.com',
  ap: 'mapi-ap.storyblok.com',
}

export const regionNames = {
  eu: 'Europe',
  us: 'United States',
  cn: 'China',
  ca: 'Canada',
  ap: 'Australia',
}

export const DEFAULT_AGENT = {
  SB_Agent: 'SB-CLI',
  SB_Agent_Version: process.env.npm_package_version || '4.x',
}
