import { fileURLToPath } from 'node:url'
import { dirname } from 'pathe'
import type { RegionCode } from '../constants'
import { regions } from '../constants'

export * from './error/'
export * from './konsola'
export const __filename = fileURLToPath(import.meta.url)
export const __dirname = dirname(__filename)

export function isRegion(value: RegionCode): value is RegionCode {
  return Object.values(regions).includes(value)
}

export function maskToken(token: string): string {
  // Show only the first 4 characters and replace the rest with asterisks
  if (token.length <= 4) {
    // If the token is too short, just return it as is
    return token
  }
  const visiblePart = token.slice(0, 4)
  const maskedPart = '*'.repeat(token.length - 4)
  return `${visiblePart}${maskedPart}`
}
