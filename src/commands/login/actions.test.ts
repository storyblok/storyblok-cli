import { describe, expect, it, vi } from 'vitest'
import { loginWithEmailAndPassword, loginWithOtp, loginWithToken } from './actions'
import { ofetch } from 'ofetch'
import chalk from 'chalk'

vi.mock('ofetch', () => ({
  ofetch: vi.fn(),
}))

describe('login actions', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('loginWithToken', () => {
    it('should login successfully with a valid token', async () => {
      const mockResponse = { data: 'user data' }
      vi.mocked(ofetch).mockResolvedValue(mockResponse)

      const result = await loginWithToken('valid-token', 'eu')
      expect(result).toEqual(mockResponse)
    })

    it('should throw an masked error for invalid token', async () => {
      const mockError = {
        response: { status: 401 },
        data: { error: 'Unauthorized' },
      }
      vi.mocked(ofetch).mockRejectedValue(mockError)

      await expect(loginWithToken('invalid-token', 'eu')).rejects.toThrow(
        new Error(`The token provided ${chalk.bold('inva*********')} is invalid: ${chalk.bold('401 Unauthorized')}

  Please make sure you are using the correct token and try again.`),
      )
    })

    it('should throw a network error if response is empty (network)', async () => {
      const mockError = new Error('Network error')
      vi.mocked(ofetch).mockRejectedValue(mockError)

      await expect(loginWithToken('any-token', 'eu')).rejects.toThrow(
        'No response from server, please check if you are correctly connected to internet',
      )
    })
  })

  describe('loginWithEmailAndPassword', () => {
    it('should login successfully with valid email and password', async () => {
      const mockResponse = { data: 'user data' }
      vi.mocked(ofetch).mockResolvedValue(mockResponse)

      const result = await loginWithEmailAndPassword('email@example.com', 'password', 'eu')
      expect(result).toEqual(mockResponse)
    })

    it('should throw a generic error for login failure', async () => {
      const mockError = new Error('Network error')
      vi.mocked(ofetch).mockRejectedValue(mockError)

      await expect(loginWithEmailAndPassword('email@example.com', 'password', 'eu')).rejects.toThrow(
        'Error logging in with email and password',
      )
    })
  })

  describe('loginWithOtp', () => {
    it('should login successfully with valid email, password, and otp', async () => {
      const mockResponse = { data: 'user data' }
      vi.mocked(ofetch).mockResolvedValue(mockResponse)

      const result = await loginWithOtp('email@example.com', 'password', '123456', 'eu')
      expect(result).toEqual(mockResponse)
    })

    it('should throw a generic error for login failure', async () => {
      const mockError = new Error('Network error')
      vi.mocked(ofetch).mockRejectedValue(mockError)

      await expect(loginWithOtp('email@example.com', 'password', '123456', 'eu')).rejects.toThrow(
        'Error logging in with email, password and otp',
      )
    })
  })
})
