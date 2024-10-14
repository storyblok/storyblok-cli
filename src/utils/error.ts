import { konsola } from '../utils'

export function handleError(error: Error, header = false): void {
  konsola.error(error, header)
  if (!process.env.VITEST) {
    console.log('') // Add a line break
    process.exit(1)
  }
}
