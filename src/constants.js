const { EU_CODE } = require('@storyblok/region-helper')
const { getRegionApiEndpoint } = require('./utils/region')

const SYNC_TYPES = ['folders', 'components', 'roles', 'stories', 'datasources']

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

// todo: FIND OUT IF THIS WORKS WITH us
const USERS_ROUTES = {
  LOGIN: `${getRegionApiEndpoint(EU_CODE)}users/login`,
  SIGNUP: `${getRegionApiEndpoint(EU_CODE)}users/signup`
}

module.exports = {
  SYNC_TYPES,
  USERS_ROUTES,
  COMMANDS,
  DEFAULT_AGENT
}
