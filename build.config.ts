import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  declaration: true,
  failOnWarn: false,
  rollup: {
    emitCJS: true,
  },
  entries: ['src/cli'],
  externals: [
    'node:url',
    'node:buffer',
    'node:path',
    'node:child_process',
    'node:process',
    'node:path',
    'node:os',
  ],
})