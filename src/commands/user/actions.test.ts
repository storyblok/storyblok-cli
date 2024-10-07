import { ofetch } from 'ofetch'
import chalk from 'chalk'
import { getUser } from './actions'

vi.mock('ofetch', () => ({
  ofetch: vi.fn(),
}))

describe('user actions', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('getUser', () => {
    it('should get user successfully with a valid token', async () => {
      const mockResponse = { data: 'user data' }
      ofetch.mockResolvedValue(mockResponse)

      const result = await getUser('valid-token', 'eu')
      expect(result).toEqual(mockResponse)
    })
  })

  it('should throw an masked error for invalid token', async () => {
    const mockError = {
      response: { status: 401 },
      data: { error: 'Unauthorized' },
    }
    ofetch.mockRejectedValue(mockError)

    await expect(getUser('invalid-token', 'eu')).rejects.toThrow(
      new Error(`The token provided ${chalk.bold('inva*********')} is invalid: ${chalk.bold('401 Unauthorized')}

  Please make sure you are using the correct token and try again.`),
    )
  })

  it('should throw a network error if response is empty (network)', async () => {
    const mockError = new Error('Network error')
    ofetch.mockRejectedValue(mockError)

    await expect(getUser('any-token', 'eu')).rejects.toThrow(
      'No response from server, please check if you are correctly connected to internet',
    )
  })
})
