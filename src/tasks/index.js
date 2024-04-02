import sync from './sync'
import scaffold from './scaffold'
import quickstart from './quickstart'
import pullComponents from './pull-components'
import pullLanguages from './pull-languages'
import pushComponents from './push-components'
import generateMigration from './migrations/generate'
import runMigration from './migrations/run'
import rollbackMigration from './migrations/rollback'
import listSpaces from './list-spaces'
import importFiles from './import/import'
import deleteComponent from './delete-component'
import deleteComponents from './delete-components'
import deleteDatasources from './delete-datasources'
import generateTypescriptTypedefs from './generate-typescript-typedefs'

export default {
  sync,
  scaffold,
  quickstart,
  pullComponents,
  pullLanguages,
  pushComponents,
  generateMigration,
  runMigration,
  rollbackMigration,
  listSpaces,
  importFiles,
  deleteComponent,
  deleteComponents,
  deleteDatasources,
  generateTypescriptTypedefs
}
