import { isAuthorized, removeNetrcEntry } from '../../creds'
import { logoutCommand } from './'

vi.mock('../../creds', () => ({
  isAuthorized: vi.fn(),
  removeNetrcEntry: vi.fn(),
}))

describe('logoutCommand', () => {
  beforeEach(() => {
    vi.resetAllMocks()
    vi.clearAllMocks()
  })

  it('should log out the user if has previously login', async () => {
    isAuthorized.mockResolvedValue(true)

    await logoutCommand.parseAsync(['node', 'test'])
    expect(removeNetrcEntry).toHaveBeenCalled()
  })

  it('should not log out the user if has not previously login', async () => {
    isAuthorized.mockResolvedValue(false)
    await logoutCommand.parseAsync(['node', 'test'])
    expect(removeNetrcEntry).not.toHaveBeenCalled()
  })
})
