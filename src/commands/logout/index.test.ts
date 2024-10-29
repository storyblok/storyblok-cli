import { isAuthorized, removeAllNetrcEntries } from '../../creds'
import { logoutCommand } from './'

vi.mock('../../creds', () => ({
  isAuthorized: vi.fn(),
  removeNetrcEntry: vi.fn(),
  removeAllNetrcEntries: vi.fn(),
}))

describe('logoutCommand', () => {
  beforeEach(() => {
    vi.resetAllMocks()
    vi.clearAllMocks()
  })

  it('should log out the user if has previously login', async () => {
    vi.mocked(isAuthorized).mockResolvedValue(true)

    await logoutCommand.parseAsync(['node', 'test'])
    expect(removeAllNetrcEntries).toHaveBeenCalled()
  })

  it('should not log out the user if has not previously login', async () => {
    vi.mocked(isAuthorized).mockResolvedValue(false)
    await logoutCommand.parseAsync(['node', 'test'])
    expect(removeAllNetrcEntries).not.toHaveBeenCalled()
  })
})
