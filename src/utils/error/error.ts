import { konsola } from '..'
import { APIError } from './api-error'
import { CommandError } from './command-error'
import { FileSystemError } from './filesystem-error'

export function handleError(error: Error, verbose = false): void {
  // If verbose flag is true and the error has getInfo method
  if (verbose && typeof (error as any).getInfo === 'function') {
    const errorDetails = (error as any).getInfo()
    if (error instanceof CommandError) {
      konsola.error(`Command Error: ${error.getInfo().message}`, errorDetails)
    }
    else if (error instanceof APIError) {
      console.log('error', error)
      konsola.error(`API Error: ${error.getInfo().cause}`, errorDetails)
    }
    else if (error instanceof FileSystemError) {
      konsola.error(`File System Error: ${error.getInfo().cause}`, errorDetails)
    }
    else {
      konsola.error(`Unexpected Error: ${error.message}`, errorDetails)
    }
  }
  else {
    // Print the message stack if it exists
    if ((error as any).messageStack) {
      const messageStack = (error as any).messageStack
      messageStack.forEach((message: string, index: number) => {
        konsola.error(message, null, {
          header: index === 0,
          margin: false,
        })
      })
      konsola.br()
      konsola.info('For more information about the error, run the command with the `--verbose` flag')
    }
    else {
      konsola.error(error.message, null, {
        header: true,
      })
    }
  }

  if (!process.env.VITEST) {
    console.log('') // Add a line break for readability
    process.exit(1) // Exit process if not in a test environment
  }
}
