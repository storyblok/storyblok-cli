import { consola } from '../utils';

export function handleError(error: Error): void {
    consola.error(error)
  // TODO: add conditional to detect if this runs on tests
  /* process.exit(1); */
}