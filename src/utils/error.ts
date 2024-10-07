import { konsola } from '../utils'

export function handleError(error: Error, header = false): void {
  konsola.error(error, header)
  // TODO: add conditional to detect if this runs on tests
  /* process.exit(1); */
}
