import chalk from 'chalk'
import { colorPalette, commands } from '../../constants'
import { session } from '../../session'
import { getProgram } from '../../program'
import { CommandError, handleError, konsola } from '../../utils'

import type { PullComponentsOptions } from './constants'

const program = getProgram() // Get the shared singleton instance

export const blocksCommand = program
  .command('block')
  .option('-s, --space <space>', 'space ID')
  .option('-p, --path <path>', 'path to where schemas are saved. Default is .storyblok/components')
  .description(`Operations on Storyblok blocks`)

blocksCommand
  .command('pull')
  .description(`Download your space's blocks schema as json`)
  .option('--sf, --separate-files [value]', 'Argument to create a single file for each component')
  .action(async (options: PullComponentsOptions) => {
    console.log('pulling blocks...', blocksCommand.opts())
  })

blocksCommand
  .command('push')
  .description(`Push your space's blocks schema as json`)
  .action(async (options: PullComponentsOptions) => {
    console.log('pushing blocks...', options)
  })
