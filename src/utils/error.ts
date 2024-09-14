import { konsola } from '../utils';

export function handleError(error: Error): void {
    konsola.error(error)
  // TODO: add conditional to detect if this runs on tests
  /* process.exit(1); */
}