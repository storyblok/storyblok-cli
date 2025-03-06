import { session } from '../../../session';
import { konsola } from '../../../utils';
// Import the main components module first to ensure proper initialization

import '../index';
import { migrationsCommand } from '../command';
import { readMigrationFiles } from './actions';
import { fetchStoriesByComponent, fetchStory, updateStory } from '../../../commands/stories/actions';
import { handleMigrations, summarizeMigrationResults } from './operations';

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
      info: vi.fn(),
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

vi.mock('../../../commands/stories/actions', () => ({
  fetchStoriesByComponent: vi.fn(),
  fetchStory: vi.fn(),
  updateStory: vi.fn(),
}));

vi.mock('./actions', () => ({
  readJavascriptFile: vi.fn(),
  readMigrationFiles: vi.fn(),
  getMigrationFunction: vi.fn(),
  applyMigrationToAllBlocks: vi.fn(),
}));

vi.mock('./operations.ts', () => ({
  handleMigrations: vi.fn(),
  summarizeMigrationResults: vi.fn(),
}));

describe('migrations run command', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    vi.clearAllMocks();
  });

  it('should run migrations', async () => {
    const mockMigrationFiles = [
      {
        name: 'migration-component.js',
        content: 'export default function (block) {\n'
          + '  // Example to change a string to boolean\n'
          + '  // block.field_name = !!(block.field_name)\n'
          + '\n'
          + '  // Example to transfer content from other field\n'
          + '  // block.target_field = block.source_field\n'
          + '\n'
          + '  // Example to transform an array\n'
          + '  // block.array_field = block.array_field.map(item => ({ ...item, new_prop: \'value\' }))\n'
          + '  /* block.amount = Number(block.amount) + 1;\n'
          + '  block.highlighted = !block.highlighted; */\n'
          + '  block.unchanged = \'unchanged\';\n'
          + '\n'
          + '  return block;\n'
          + '}\n',
      },
      {
        name: 'migration-component.amount.js',
        content: 'export default function (block) {\n'
          + '  // Example to change a string to boolean\n'
          + '  // block.field_name = !!(block.field_name)\n'
          + '\n'
          + '  // Example to transfer content from other field\n'
          + '  // block.target_field = block.source_field\n'
          + '\n'
          + '  // Example to transform an array\n'
          + '  // block.array_field = block.array_field.map(item => ({ ...item, new_prop: \'value\' }))\n'
          + '  block.amount = Number(block.amount) + 1\n'
          + '  return block;\n'
          + '}\n',
      },
      {
        name: 'simple_component.js',
        content: 'export default function (block) {\n'
          + '  // Example to change a string to boolean\n'
          + '  // block.field_name = !!(block.field_name)\n'
          + '\n'
          + '  // Example to transfer content from other field\n'
          + '  // block.target_field = block.source_field\n'
          + '\n'
          + '  // Example to transform an array\n'
          + '  // block.array_field = block.array_field.map(item => ({ ...item, new_prop: \'value\' }))\n'
          + '  block.fullname = block.name + " " + block.lastname;\n'
          + '  return block;\n'
          + '}\n',
      },
    ];

    const mockStories = [
      {
        name: 'Home',
        parent_id: 0,
        group_id: '24e2bb36-4003-459b-af6c-9115c873be20',
        updated_at: '2025-03-03T08:47:49.570Z',
        published_at: '2025-02-26T14:31:33.640Z',
        id: 517473243,
        uuid: '68199c8e-a267-4100-8945-70159982db27',
        slug: 'home',
        path: null,
        full_slug: 'home',
        content: {
          _uid: '4b16d1ea-4306-47c5-b901-9d67d5babf53',
          component: 'page',
          body: [
            {
              _uid: '216ba4ef-1298-4b7d-8ce0-7487e6db15cc',
              games: 'bg3',
              title: 'Home migration component',
              amount: 10,
              component: 'migration-component',
              unchanged: 'unchanged',
              highlighted: true,
            },
            {
              _uid: '2168b41b-c0b6-4ac8-9d25-c69ab814feba',
              name: 'Julio',
              title: 'Awiwi',
              visible: true,
              fullname: 'Julio Iglesias',
              lastname: 'Iglesias',
              component: 'simple_component',
            },
          ],
        },
        created_at: '2025-02-26T14:31:33.640Z',
        first_published_at: '2025-02-26T14:31:33.640Z',
        published: true,
        unpublished_changes: false,
        is_startpage: false,
        is_folder: false,
        pinned: false,
        parent: null,
        position: 0,
        sort_by_date: null,
        tag_list: [],
        disable_fe_editor: false,
        default_root: null,
        preview_token: null,
        meta_data: null,
        release_id: null,
        last_author: null,
        last_author_id: null,
        alternates: [],
        translated_slugs: null,
        translated_slugs_attributes: null,
        localized_paths: null,
        breadcrumbs: [],
        scheduled_dates: null,
        favourite_for_user_ids: [],
        imported_at: null,
        deleted_at: null,
      },
    ];

    const mockSingleStory = {
      id: 517473243,
      name: 'Home',
      uuid: '68199c8e-a267-4100-8945-70159982db27',
      slug: 'home',
      full_slug: 'home',
      content: {
        _uid: '4b16d1ea-4306-47c5-b901-9d67d5babf53',
        body: [
          {
            _uid: '216ba4ef-1298-4b7d-8ce0-7487e6db15cc',
            games: 'bg3',
            title: 'Home migration component',
            amount: 10,
            component: 'migration-component',
            unchanged: 'unchanged',
            highlighted: true,
          },
          {
            _uid: '2168b41b-c0b6-4ac8-9d25-c69ab814feba',
            name: 'Julio',
            title: 'Awiwi',
            visible: true,
            fullname: 'Julio Iglesias',
            lastname: 'Iglesias',
            component: 'simple_component',
          },
        ],
        component: 'page',
      },
      created_at: '2025-02-26T14:31:33.640Z',
      updated_at: '2025-03-03T08:47:49.570Z',
      published_at: '2025-02-26T14:31:33.640Z',
      first_published_at: '2025-02-26T14:31:33.640Z',
      published: true,
      unpublished_changes: false,
      is_startpage: false,
      is_folder: false,
      pinned: false,
      parent_id: 0,
      group_id: '24e2bb36-4003-459b-af6c-9115c873be20',
      parent: null,
      path: null,
      position: 0,
      sort_by_date: null,
      tag_list: [],
      disable_fe_editor: false,
      default_root: null,
      preview_token: null,
      meta_data: null,
      release_id: null,
      last_author: null,
      last_author_id: null,
      alternates: [],
      translated_slugs: null,
      translated_slugs_attributes: null,
      localized_paths: null,
      breadcrumbs: [],
      scheduled_dates: null,
      favourite_for_user_ids: [],
      imported_at: null,
      deleted_at: null,
    };

    const mockMigrationResults = {
      successful: [
        {
          storyId: 517473243,
          name: 'Home',
          migrationName: 'migration-component.js',
          content: mockSingleStory.content,
        },
      ],
      failed: [],
      skipped: [],
    };

    session().state = {
      isLoggedIn: true,
      password: 'valid-token',
      region: 'eu',
    };

    vi.mocked(readMigrationFiles).mockResolvedValue(
      mockMigrationFiles,
    );

    vi.mocked(fetchStoriesByComponent).mockResolvedValue(mockStories);

    vi.mocked(fetchStory).mockResolvedValue(mockSingleStory);

    vi.mocked(handleMigrations).mockResolvedValue(mockMigrationResults);

    vi.mocked(updateStory).mockResolvedValue(mockSingleStory);

    await migrationsCommand.parseAsync(['node', 'test', 'run', '--space', '12345']);

    expect(readMigrationFiles).toHaveBeenCalledWith({
      space: '12345',
      path: undefined,
      filter: undefined,
    });

    expect(fetchStoriesByComponent).toHaveBeenCalledWith(
      {
        spaceId: '12345',
        token: 'valid-token',
        region: 'eu',
      },
      {},
    );
    expect(fetchStory).toHaveBeenCalledWith('12345', 'valid-token', 'eu', '517473243');
    expect(handleMigrations).toHaveBeenCalledWith({
      migrationFiles: mockMigrationFiles,
      stories: [
        {
          ...mockStories[0],
          content: mockSingleStory.content,
        },
      ],
      space: '12345',
      path: undefined,
      componentName: undefined,
      password: 'valid-token',
      region: 'eu',
    });

    expect(summarizeMigrationResults).toHaveBeenCalledWith(mockMigrationResults);

    expect(updateStory).toHaveBeenCalledWith(
      '12345',
      'valid-token',
      'eu',
      517473243,
      mockSingleStory.content,
    );
  });

  it('should run migrations with a component name', async () => {
    const mockMigrationFiles = [
      {
        name: 'migration-component.js',
        content: 'export default function (block) {\n'
          + '  block.unchanged = \'unchanged\';\n'
          + '  return block;\n'
          + '}\n',
      },
      {
        name: 'migration-component.amount.js',
        content: 'export default function (block) {\n'
          + '  block.amount = Number(block.amount) + 1\n'
          + '  return block;\n'
          + '}\n',
      },
    ];

    const mockStories = [
      {
        name: 'Home',
        parent_id: 0,
        group_id: '24e2bb36-4003-459b-af6c-9115c873be20',
        updated_at: '2025-03-03T08:47:49.570Z',
        published_at: '2025-02-26T14:31:33.640Z',
        id: 517473243,
        uuid: '68199c8e-a267-4100-8945-70159982db27',
        slug: 'home',
        path: null,
        full_slug: 'home',
        content: {
          _uid: '4b16d1ea-4306-47c5-b901-9d67d5babf53',
          component: 'page',
          body: [
            {
              _uid: '216ba4ef-1298-4b7d-8ce0-7487e6db15cc',
              games: 'bg3',
              title: 'Home migration component',
              amount: 10,
              component: 'migration-component',
              unchanged: 'unchanged',
              highlighted: true,
            },
          ],
        },
        created_at: '2025-02-26T14:31:33.640Z',
        first_published_at: '2025-02-26T14:31:33.640Z',
        published: true,
        unpublished_changes: false,
        is_startpage: false,
        is_folder: false,
        pinned: false,
        parent: null,
        position: 0,
        sort_by_date: null,
        tag_list: [],
        disable_fe_editor: false,
        default_root: null,
        preview_token: null,
        meta_data: null,
        release_id: null,
        last_author: null,
        last_author_id: null,
        alternates: [],
        translated_slugs: null,
        translated_slugs_attributes: null,
        localized_paths: null,
        breadcrumbs: [],
        scheduled_dates: null,
        favourite_for_user_ids: [],
        imported_at: null,
        deleted_at: null,
      },
    ];

    const mockSingleStory = {
      ...mockStories[0],
    };

    const mockMigrationResults = {
      successful: [
        {
          storyId: 517473243,
          name: 'Home',
          migrationName: 'migration-component.amount.js',
          content: mockSingleStory.content,
        },
      ],
      failed: [],
      skipped: [],
    };

    session().state = {
      isLoggedIn: true,
      password: 'valid-token',
      region: 'eu',
    };

    vi.mocked(readMigrationFiles).mockResolvedValue(mockMigrationFiles);
    vi.mocked(fetchStoriesByComponent).mockResolvedValue(mockStories);
    vi.mocked(fetchStory).mockResolvedValue(mockSingleStory);
    vi.mocked(handleMigrations).mockResolvedValue(mockMigrationResults);
    vi.mocked(updateStory).mockResolvedValue(mockSingleStory);

    await migrationsCommand.parseAsync(['node', 'test', 'run', 'migration-component', '--space', '12345']);

    expect(readMigrationFiles).toHaveBeenCalledWith({
      space: '12345',
      path: undefined,
      filter: undefined,
    });

    expect(fetchStoriesByComponent).toHaveBeenCalledWith(
      {
        spaceId: '12345',
        token: 'valid-token',
        region: 'eu',
      },
      {
        componentName: 'migration-component',
      },
    );
    expect(fetchStory).toHaveBeenCalledWith('12345', 'valid-token', 'eu', '517473243');
    expect(handleMigrations).toHaveBeenCalledWith({
      migrationFiles: mockMigrationFiles,
      stories: [
        {
          ...mockStories[0],
          content: mockSingleStory.content,
        },
      ],
      space: '12345',
      path: undefined,
      componentName: 'migration-component',
      password: 'valid-token',
      region: 'eu',
    });

    expect(summarizeMigrationResults).toHaveBeenCalledWith(mockMigrationResults);

    expect(updateStory).toHaveBeenCalledWith(
      '12345',
      'valid-token',
      'eu',
      517473243,
      mockSingleStory.content,
    );
  });

  it('should run migrations by filter', async () => {
    const mockMigrationFiles = [
      {
        name: 'migration-component.amount.js',
        content: 'export default function (block) {\n'
          + '  block.amount = Number(block.amount) + 1\n'
          + '  return block;\n'
          + '}\n',
      },
    ];

    const mockStories = [
      {
        name: 'Home',
        parent_id: 0,
        group_id: '24e2bb36-4003-459b-af6c-9115c873be20',
        updated_at: '2025-03-03T08:47:49.570Z',
        published_at: '2025-02-26T14:31:33.640Z',
        id: 517473243,
        uuid: '68199c8e-a267-4100-8945-70159982db27',
        slug: 'home',
        path: null,
        full_slug: 'home',
        content: {
          _uid: '4b16d1ea-4306-47c5-b901-9d67d5babf53',
          component: 'page',
          body: [
            {
              _uid: '216ba4ef-1298-4b7d-8ce0-7487e6db15cc',
              games: 'bg3',
              title: 'Home migration component',
              amount: 10,
              component: 'migration-component',
              unchanged: 'unchanged',
              highlighted: true,
            },
          ],
        },
        created_at: '2025-02-26T14:31:33.640Z',
        first_published_at: '2025-02-26T14:31:33.640Z',
        published: true,
        unpublished_changes: false,
        is_startpage: false,
        is_folder: false,
        pinned: false,
        parent: null,
        position: 0,
        sort_by_date: null,
        tag_list: [],
        disable_fe_editor: false,
        default_root: null,
        preview_token: null,
        meta_data: null,
        release_id: null,
        last_author: null,
        last_author_id: null,
        alternates: [],
        translated_slugs: null,
        translated_slugs_attributes: null,
        localized_paths: null,
        breadcrumbs: [],
        scheduled_dates: null,
        favourite_for_user_ids: [],
        imported_at: null,
        deleted_at: null,
      },
    ];

    const mockSingleStory = {
      ...mockStories[0],
    };

    const mockMigrationResults = {
      successful: [
        {
          storyId: 517473243,
          name: 'Home',
          migrationName: 'migration-component.amount.js',
          content: mockSingleStory.content,
        },
      ],
      failed: [],
      skipped: [],
    };

    session().state = {
      isLoggedIn: true,
      password: 'valid-token',
      region: 'eu',
    };

    vi.mocked(readMigrationFiles).mockResolvedValue(mockMigrationFiles);
    vi.mocked(fetchStoriesByComponent).mockResolvedValue(mockStories);
    vi.mocked(fetchStory).mockResolvedValue(mockSingleStory);
    vi.mocked(handleMigrations).mockResolvedValue(mockMigrationResults);
    vi.mocked(updateStory).mockResolvedValue(mockSingleStory);

    await migrationsCommand.parseAsync(['node', 'test', 'run', '--space', '12345', '--filter', '*.amount.js']);

    expect(readMigrationFiles).toHaveBeenCalledWith({
      space: '12345',
      path: undefined,
      filter: '*.amount.js',
    });

    expect(fetchStoriesByComponent).toHaveBeenCalledWith(
      {
        spaceId: '12345',
        token: 'valid-token',
        region: 'eu',
      },
      {},
    );
    expect(fetchStory).toHaveBeenCalledWith('12345', 'valid-token', 'eu', '517473243');
    expect(handleMigrations).toHaveBeenCalledWith({
      migrationFiles: mockMigrationFiles,
      stories: [
        {
          ...mockStories[0],
          content: mockSingleStory.content,
        },
      ],
      space: '12345',
      path: undefined,
      componentName: undefined,
      password: 'valid-token',
      region: 'eu',
    });

    expect(summarizeMigrationResults).toHaveBeenCalledWith(mockMigrationResults);

    expect(updateStory).toHaveBeenCalledWith(
      '12345',
      'valid-token',
      'eu',
      517473243,
      mockSingleStory.content,
    );
  });

  it('should run the migrations with a dry run', async () => {
    const mockMigrationFiles = [
      {
        name: 'migration-component.js',
        content: 'export default function (block) {\n'
          + '  block.unchanged = \'unchanged\';\n'
          + '  return block;\n'
          + '}\n',
      },
    ];

    const mockStories = [
      {
        name: 'Home',
        parent_id: 0,
        group_id: '24e2bb36-4003-459b-af6c-9115c873be20',
        updated_at: '2025-03-03T08:47:49.570Z',
        published_at: '2025-02-26T14:31:33.640Z',
        id: 517473243,
        uuid: '68199c8e-a267-4100-8945-70159982db27',
        slug: 'home',
        path: null,
        full_slug: 'home',
        content: {
          _uid: '4b16d1ea-4306-47c5-b901-9d67d5babf53',
          component: 'page',
          body: [
            {
              _uid: '216ba4ef-1298-4b7d-8ce0-7487e6db15cc',
              component: 'migration-component',
              unchanged: 'unchanged',
            },
          ],
        },
        created_at: '2025-02-26T14:31:33.640Z',
        first_published_at: '2025-02-26T14:31:33.640Z',
        published: true,
        unpublished_changes: false,
        is_startpage: false,
        is_folder: false,
        pinned: false,
        parent: null,
        position: 0,
        sort_by_date: null,
        tag_list: [],
        disable_fe_editor: false,
        default_root: null,
        preview_token: null,
        meta_data: null,
        release_id: null,
        last_author: null,
        last_author_id: null,
        alternates: [],
        translated_slugs: null,
        translated_slugs_attributes: null,
        localized_paths: null,
        breadcrumbs: [],
        scheduled_dates: null,
        favourite_for_user_ids: [],
        imported_at: null,
        deleted_at: null,
      },
    ];

    const mockSingleStory = {
      ...mockStories[0],
    };

    const mockMigrationResults = {
      successful: [
        {
          storyId: 517473243,
          name: 'Home',
          migrationName: 'migration-component.js',
          content: mockSingleStory.content,
        },
      ],
      failed: [],
      skipped: [],
    };

    session().state = {
      isLoggedIn: true,
      password: 'valid-token',
      region: 'eu',
    };

    vi.mocked(readMigrationFiles).mockResolvedValue(mockMigrationFiles);
    vi.mocked(fetchStoriesByComponent).mockResolvedValue(mockStories);
    vi.mocked(fetchStory).mockResolvedValue(mockSingleStory);
    vi.mocked(handleMigrations).mockResolvedValue(mockMigrationResults);

    await migrationsCommand.parseAsync(['node', 'test', 'run', '--space', '12345', '--dry-run']);

    // Key assertion: updateStory should not be called in dry run mode
    expect(updateStory).not.toHaveBeenCalled();
  });

  it('should not update stories when no successful migrations', async () => {
    const mockMigrationFiles = [
      {
        name: 'migration-component.js',
        content: 'export default function (block) {\n'
          + '  block.unchanged = \'unchanged\';\n'
          + '  return block;\n'
          + '}\n',
      },
    ];

    const mockStories = [
      {
        name: 'Home',
        parent_id: 0,
        group_id: '24e2bb36-4003-459b-af6c-9115c873be20',
        updated_at: '2025-03-03T08:47:49.570Z',
        published_at: '2025-02-26T14:31:33.640Z',
        id: 517473243,
        uuid: '68199c8e-a267-4100-8945-70159982db27',
        slug: 'home',
        path: null,
        full_slug: 'home',
        content: {
          _uid: '4b16d1ea-4306-47c5-b901-9d67d5babf53',
          component: 'page',
          body: [
            {
              _uid: '216ba4ef-1298-4b7d-8ce0-7487e6db15cc',
              component: 'migration-component',
              unchanged: 'unchanged',
            },
          ],
        },
        created_at: '2025-02-26T14:31:33.640Z',
        first_published_at: '2025-02-26T14:31:33.640Z',
        published: true,
        unpublished_changes: false,
        is_startpage: false,
        is_folder: false,
        pinned: false,
        parent: null,
        position: 0,
        sort_by_date: null,
        tag_list: [],
        disable_fe_editor: false,
        default_root: null,
        preview_token: null,
        meta_data: null,
        release_id: null,
        last_author: null,
        last_author_id: null,
        alternates: [],
        translated_slugs: null,
        translated_slugs_attributes: null,
        localized_paths: null,
        breadcrumbs: [],
        scheduled_dates: null,
        favourite_for_user_ids: [],
        imported_at: null,
        deleted_at: null,
      },
    ];

    const mockSingleStory = {
      ...mockStories[0],
    };

    const mockMigrationResults = {
      successful: [],
      failed: [
        {
          storyId: 517473243,
          name: 'Home',
          migrationName: 'migration-component.js',
          error: 'Migration failed',
        },
      ],
      skipped: [],
    };

    session().state = {
      isLoggedIn: true,
      password: 'valid-token',
      region: 'eu',
    };

    vi.mocked(readMigrationFiles).mockResolvedValue(mockMigrationFiles);
    vi.mocked(fetchStoriesByComponent).mockResolvedValue(mockStories);
    vi.mocked(fetchStory).mockResolvedValue(mockSingleStory);
    vi.mocked(handleMigrations).mockResolvedValue(mockMigrationResults);

    await migrationsCommand.parseAsync(['node', 'test', 'run', '--space', '12345']);

    expect(readMigrationFiles).toHaveBeenCalledWith({
      space: '12345',
      path: undefined,
      filter: undefined,
    });

    expect(fetchStoriesByComponent).toHaveBeenCalledWith(
      {
        spaceId: '12345',
        token: 'valid-token',
        region: 'eu',
      },
      {},
    );
    expect(fetchStory).toHaveBeenCalledWith('12345', 'valid-token', 'eu', '517473243');
    expect(handleMigrations).toHaveBeenCalledWith({
      migrationFiles: mockMigrationFiles,
      stories: [
        {
          ...mockStories[0],
          content: mockSingleStory.content,
        },
      ],
      space: '12345',
      path: undefined,
      componentName: undefined,
      password: 'valid-token',
      region: 'eu',
    });

    expect(summarizeMigrationResults).toHaveBeenCalledWith(mockMigrationResults);

    // Key assertion: updateStory should not be called when there are no successful migrations
    expect(updateStory).not.toHaveBeenCalled();
    expect(konsola.info).toHaveBeenCalledWith('No stories were modified by the migrations.');
  });

  it('should run migrations with starts_with filter', async () => {
    const mockMigrationFiles = [
      {
        name: 'migration-component.js',
        content: 'export default function (block) {\n'
          + '  block.unchanged = \'unchanged\';\n'
          + '  return block;\n'
          + '}\n',
      },
    ];

    const mockStories = [
      {
        name: 'Blog Post',
        parent_id: 0,
        group_id: '24e2bb36-4003-459b-af6c-9115c873be20',
        updated_at: '2025-03-03T08:47:49.570Z',
        published_at: '2025-02-26T14:31:33.640Z',
        id: 517473243,
        uuid: '68199c8e-a267-4100-8945-70159982db27',
        slug: 'blog-post',
        path: '/en/blog/blog-post',
        full_slug: 'en/blog/blog-post',
        content: {
          _uid: '4b16d1ea-4306-47c5-b901-9d67d5babf53',
          component: 'page',
          body: [
            {
              _uid: '216ba4ef-1298-4b7d-8ce0-7487e6db15cc',
              component: 'migration-component',
              unchanged: 'unchanged',
            },
          ],
        },
        created_at: '2025-02-26T14:31:33.640Z',
        first_published_at: '2025-02-26T14:31:33.640Z',
        published: true,
        unpublished_changes: false,
        is_startpage: false,
        is_folder: false,
        pinned: false,
        parent: null,
        position: 0,
        sort_by_date: null,
        tag_list: [],
        disable_fe_editor: false,
        default_root: null,
        preview_token: null,
        meta_data: null,
        release_id: null,
        last_author: null,
        last_author_id: null,
        alternates: [],
        translated_slugs: null,
        translated_slugs_attributes: null,
        localized_paths: null,
        breadcrumbs: [],
        scheduled_dates: null,
        favourite_for_user_ids: [],
        imported_at: null,
        deleted_at: null,
      },
    ];

    const mockSingleStory = {
      ...mockStories[0],
    };

    const mockMigrationResults = {
      successful: [
        {
          storyId: 517473243,
          name: 'Blog Post',
          migrationName: 'migration-component.js',
          content: mockSingleStory.content,
        },
      ],
      failed: [],
      skipped: [],
    };

    session().state = {
      isLoggedIn: true,
      password: 'valid-token',
      region: 'eu',
    };

    vi.mocked(readMigrationFiles).mockResolvedValue(mockMigrationFiles);
    vi.mocked(fetchStoriesByComponent).mockResolvedValue(mockStories);
    vi.mocked(fetchStory).mockResolvedValue(mockSingleStory);
    vi.mocked(handleMigrations).mockResolvedValue(mockMigrationResults);
    vi.mocked(updateStory).mockResolvedValue(mockSingleStory);

    await migrationsCommand.parseAsync(['node', 'test', 'run', '--space', '12345', '--starts-with', '/en/blog/']);

    expect(readMigrationFiles).toHaveBeenCalledWith({
      space: '12345',
      path: undefined,
      filter: undefined,
    });

    expect(fetchStoriesByComponent).toHaveBeenCalledWith(
      {
        spaceId: '12345',
        token: 'valid-token',
        region: 'eu',
      },
      {
        starts_with: '/en/blog/',
      },
    );
    expect(fetchStory).toHaveBeenCalledWith('12345', 'valid-token', 'eu', '517473243');
    expect(handleMigrations).toHaveBeenCalledWith({
      migrationFiles: mockMigrationFiles,
      stories: [
        {
          ...mockStories[0],
          content: mockSingleStory.content,
        },
      ],
      space: '12345',
      path: undefined,
      componentName: undefined,
      password: 'valid-token',
      region: 'eu',
    });

    expect(summarizeMigrationResults).toHaveBeenCalledWith(mockMigrationResults);

    expect(updateStory).toHaveBeenCalledWith(
      '12345',
      'valid-token',
      'eu',
      517473243,
      mockSingleStory.content,
    );
  });
});
