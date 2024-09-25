import { fileURLToPath } from 'node:url'
import { dirname } from 'pathe'
import { regions } from '../constants'

export * from './error'
export * from './konsola'
export const __filename = fileURLToPath(import.meta.url)
export const __dirname = dirname(__filename)

export function isRegion(value: string): value is keyof typeof regions {
  return Object.values(regions).includes(value)
}
