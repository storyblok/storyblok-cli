const SYNC_TYPES = [
  'folders',
  'components',
  'roles',
  'stories',
  'datasources'
]

const COMMANDS = {
  GENERATE_MIGRATION: 'generate-migration',
  IMPORT: 'import',
  LOGIN: 'login',
  LOGOUT: 'logout',
  PULL_COMPONENTS: 'pull-components',
  PUSH_COMPONENTS: 'push-components',
  QUICKSTART: 'quickstart',
  ROLLBACK_MIGRATION: 'rollback-migration',
  RUN_MIGRATION: 'run-migration',
  SCAFFOLD: 'scaffold',
  SELECT: 'select',
  SPACES: 'spaces',
  SYNC: 'sync',
  DELETE_DATASOURCES: 'delete-datasources'
}

const DEFAULT_AGENT = {
  SB_Agent: 'SB-CLI',
  SB_Agent_Version: process.env.npm_package_version || '3.0.0'
}

const REGIONS = {
  cn: {
    key: 'cn',
    name: 'China',
    apiEndpoint: 'https://app.storyblokchina.cn/v1/'
  },
  eu: {
    key: 'eu',
    name: 'Europe',
    apiEndpoint: 'https://api.storyblok.com/v1/'
  },
  us: {
    key: 'us',
    name: 'United States',
    apiEndpoint: 'https://api-us.storyblok.com/v1/'
  },
  ca: {
    key: 'ca',
    name: 'Canada',
    apiEndpoint: 'https://api-ca.storyblok.com/v1/'
  },
  ap: {
    key: 'ap',
    name: 'Australia',
    apiEndpoint: 'https://api-ap.storyblok.com/v1/'
  }
}

const USERS_ROUTES = {
  LOGIN: `${REGIONS.eu.apiEndpoint}users/login`,
  SIGNUP: `${REGIONS.eu.apiEndpoint}users/signup`
}

module.exports = {
  SYNC_TYPES,
  USERS_ROUTES,
  COMMANDS,
  DEFAULT_AGENT,
  REGIONS
}
