import { konsola } from '../../../utils';
import { fetchComponent } from '../../../commands/components';
import { generateMigration } from './actions';
// Import the main components module first to ensure proper initialization
import '../index';
import { migrationsCommand } from '../command';

// Mock dependencies
vi.mock('../../../utils', async () => {
  const actualUtils = await vi.importActual('../../../utils');
  return {
    ...actualUtils,
    isVitestRunning: true,
    konsola: {
      ok: vi.fn(),
      title: vi.fn(),
      warn: vi.fn(),
      error: vi.fn(),
      br: vi.fn(),
    },
    handleError: (error: unknown, header = false) => {
      konsola.error(error as string, header);
      // Optionally, prevent process.exit during tests
    },
  };
});

// Mock the session module
vi.mock('../../../session', () => {
  let _cache: Record<string, any> | null = null;
  const session = () => {
    if (!_cache) {
      _cache = {
        state: {
          isLoggedIn: true,
          password: 'mock-token',
          region: 'eu',
        },
        updateSession: vi.fn(),
        persistCredentials: vi.fn(),
        initializeSession: vi.fn(),
        logout: vi.fn(),
      };
    }
    return _cache;
  };

  return {
    session,
  };
});

vi.mock('../../../commands/components', () => ({
  fetchComponent: vi.fn(),
}));

vi.mock('./actions', () => ({
  generateMigration: vi.fn(),
}));

vi.mock('../../../program', () => ({
  getProgram: vi.fn(() => ({
    opts: () => ({ verbose: false }),
  })),
}));

describe('migrations generate command', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(fetchComponent).mockResolvedValue(mockComponent);
    vi.mocked(generateMigration).mockResolvedValue(undefined);

    // Reset the option values
    migrationsCommand._optionValues = {};
    migrationsCommand._optionValueSources = {};
    for (const command of migrationsCommand.commands) {
      command._optionValueSources = {};
      command._optionValues = {};
    }
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

/*   it('should throw error if component name is not provided', async () => {
    // Act
    await migrationsCommand.parseAsync(['node', 'test', 'generate']);

    // Assert
    expect(handleError).toHaveBeenCalledWith(
      expect.any(CommandError),
      false,
    );
    expect(fetchComponent).not.toHaveBeenCalled();
    expect(generateMigration).not.toHaveBeenCalled();
  });

  it('should throw error if user is not logged in', async () => {
    // Arrange
    vi.mocked(session).mockReturnValueOnce({
      state: {
        isLoggedIn: false,
        password: undefined,
        region: undefined,
      },
      initializeSession: vi.fn(),
      updateSession: vi.fn(),
      persistCredentials: vi.fn(),
      logout: vi.fn(),
    });

    // Act
    await migrationsCommand.parseAsync(['node', 'test', 'generate', 'test-component', '--field', 'title']);

    // Assert
    expect(handleError).toHaveBeenCalledWith(
      expect.any(CommandError),
      false,
    );
    expect(fetchComponent).not.toHaveBeenCalled();
    expect(generateMigration).not.toHaveBeenCalled();
  });

  it('should throw error if space is not provided', async () => {
    // Arrange
    migrationsCommand.opts = vi.fn().mockReturnValue({ space: undefined, path: '' });

    // Act
    await migrationsCommand.parseAsync(['node', 'test', 'generate', 'test-component', '--field', 'title']);

    // Assert
    expect(handleError).toHaveBeenCalledWith(
      expect.any(CommandError),
      false,
    );
    expect(fetchComponent).not.toHaveBeenCalled();
    expect(generateMigration).not.toHaveBeenCalled();
  });

  it('should throw error if component is not found', async () => {
    // Arrange
    vi.mocked(fetchComponent).mockResolvedValue(undefined);

    // Act
    await migrationsCommand.parseAsync(['node', 'test', 'generate', 'non-existent-component', '--field', 'title']);

    // Assert
    expect(handleError).toHaveBeenCalledWith(
      expect.any(CommandError),
      false,
    );
    expect(fetchComponent).toHaveBeenCalledWith(
      '123456',
      'non-existent-component',
      'mock-token',
      'eu',
    );
    expect(generateMigration).not.toHaveBeenCalled();
  });

  it('should generate migration file successfully', async () => {
    // Act
    await migrationsCommand.parseAsync(['node', 'test', 'generate', 'test-component', '--field', 'title']);

    // Assert
    expect(fetchComponent).toHaveBeenCalledWith(
      '123456',
      'test-component',
      'mock-token',
      'eu',
    );
    expect(generateMigration).toHaveBeenCalledWith(
      '123456',
      '',
      mockComponent,
      'title',
    );
    expect(konsola.ok).toHaveBeenCalled();
    expect(handleError).not.toHaveBeenCalled();
  });

  it('should handle errors during execution', async () => {
    // Arrange
    const mockError = new Error('Something went wrong');
    vi.mocked(fetchComponent).mockRejectedValue(mockError);

    // Act
    await migrationsCommand.parseAsync(['node', 'test', 'generate', 'test-component', '--field', 'title']);

    // Assert
    expect(handleError).toHaveBeenCalledWith(mockError, false);
    expect(generateMigration).not.toHaveBeenCalled();
  }); */
});
