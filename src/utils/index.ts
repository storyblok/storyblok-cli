import { fileURLToPath } from 'node:url';
import { dirname } from 'pathe';

export * from './error';
export * from './konsola'
export const __filename = fileURLToPath(import.meta.url);
export const __dirname = dirname(__filename);