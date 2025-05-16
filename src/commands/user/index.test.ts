import { userCommand } from './';
import { getUser } from './actions';
import { CommandError, konsola } from '../../utils';
import { session } from '../../session';
import chalk from 'chalk';
import { colorPalette } from '../../constants';
import type { StoryblokUser } from '../../types';

vi.mock('./actions', () => ({
  getUser: vi.fn(),
}));

vi.mock('../../creds', () => ({
  isAuthorized: vi.fn(),
}));

// Mocking the session module
vi.mock('../../session', () => {
  let _cache: {
    state: {
      isLoggedIn: boolean;
      password?: string;
      region?: string;
    };
    updateSession: () => void;
    persistCredentials: () => void;
    initializeSession: () => Promise<void>;
  } | null = null;

  const session = () => {
    if (!_cache) {
      _cache = {
        state: {
          isLoggedIn: false,
        },
        updateSession: vi.fn(),
        persistCredentials: vi.fn(),
        initializeSession: vi.fn(),
      };
    }
    return _cache;
  };

  return {
    session,
  };
});

vi.mock('../../utils', async () => {
  const actualUtils = await vi.importActual('../../utils');
  return {
    ...actualUtils,
    konsola: {
      ok: vi.fn(),
      title: vi.fn(),
      error: vi.fn(),
      br: vi.fn(),
    },
    handleError: (error: Error, header = false) => {
      konsola.error(error.message, header);
      // Optionally, prevent process.exit during tests
    },
  };
});

describe('userCommand', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    vi.clearAllMocks();
  });

  it('should show the user information', async () => {
    const mockUser: StoryblokUser = {
      id: 1,
      friendly_name: 'John Doe',
      email: 'john.doe@storyblok.com',
      username: 'johndoe',
      otp_required: false,
      access_token: 'valid-token',
    };
    session().state = {
      isLoggedIn: true,
      password: 'valid-token',
      region: 'eu',
    };
    vi.mocked(getUser).mockResolvedValue(mockUser);
    await userCommand.parseAsync(['node', 'test']);

    expect(getUser).toHaveBeenCalled();
    expect(konsola.ok).toHaveBeenCalledWith(
      `Hi ${chalk.bold('John Doe')}, you are currently logged in with ${chalk.hex(colorPalette.PRIMARY)(mockUser.email)} on ${chalk.bold('eu')} region`,
      true,
    );
  });

  it('should show an error if the user is not logged in', async () => {
    session().state = {
      isLoggedIn: false,
    };
    await userCommand.parseAsync(['node', 'test']);

    expect(konsola.error).toHaveBeenCalledWith(new CommandError(`You are currently not logged in. Please login first to get your user info.`).message, false);
  });

  it('should show an error if the user information cannot be fetched', async () => {
    session().state = {
      isLoggedIn: true,
      password: 'valid-token',
      region: 'eu',
    };

    const mockError = new Error('Network error');

    vi.mocked(getUser).mockRejectedValue(mockError);

    await userCommand.parseAsync(['node', 'test']);

    expect(konsola.error).toHaveBeenCalledWith(mockError.message, true);
  });
});
