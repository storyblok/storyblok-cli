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
  DELETE_DATASOURCES: 'delete-datasources',
  GENERATE_TYPESCRIPT_TYPEDEFS: 'generate-typescript-typedefs'
}

const DEFAULT_AGENT = {
  SB_Agent: 'SB-CLI',
  SB_Agent_Version: process.env.npm_package_version || '3.0.0'
}

module.exports = {
  SYNC_TYPES,
  COMMANDS,
  DEFAULT_AGENT
}
