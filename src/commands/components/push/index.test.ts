import { session } from '../../../session';
import { CommandError, konsola } from '../../../utils';
import { readComponentsFiles } from './actions';

// Import the main components module first to ensure proper initialization
import '../index';
import { componentsCommand } from '../command';
import { filterSpaceDataByComponent, filterSpaceDataByPattern, handleComponentGroups, handleComponents, handleTags, handleWhitelists } from './operations';

vi.mock('./actions', () => ({
  readComponentsFiles: vi.fn(),
}));

vi.mock('./operations.ts', () => ({
  filterSpaceDataByComponent: vi.fn(),
  filterSpaceDataByPattern: vi.fn(),
  handleComponentGroups: vi.fn(),
  handleComponents: vi.fn(),
  handleTags: vi.fn(),
  handleWhitelists: vi.fn(),
}));

// Mocking the session module
vi.mock('../../../session', () => {
  let _cache: Record<string, any> | null = null;
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

vi.mock('../../../utils', async () => {
  const actualUtils = await vi.importActual('../../../utils');
  return {
    ...actualUtils,
    isVitestRunning: true,
    konsola: {
      ok: vi.fn(),
      title: vi.fn(),
      info: vi.fn(),
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

describe('push', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    vi.clearAllMocks();
    // Reset the option values
    componentsCommand._optionValues = {};
    componentsCommand._optionValueSources = {};
    for (const command of componentsCommand.commands) {
      command._optionValueSources = {};
      command._optionValues = {};
    }
  });

  // TODO: re-structure test
  describe('default mode', () => {
    it('should push components without dependencies', async () => {
      const mockedSpaceData = {
        components: [{
          name: 'component-name',
          display_name: 'Component Name',
          created_at: '2021-08-09T12:00:00Z',
          updated_at: '2021-08-09T12:00:00Z',
          id: 12345,
          schema: { type: 'object' },
          color: null,
        }],
        groups: [],
        presets: [],
        internalTags: [],
      };

      const mockedWhitelistResults = {
        successful: [],
        failed: [],
        groupsUuidMap: new Map(),
        tagsIdMap: new Map(),
        componentNameMap: new Map(),
        processedTagIds: new Set(),
        processedGroupUuids: new Set(),
        processedComponentNames: new Set(),
      };

      const mockedTagsResults = {
        successful: [],
        failed: [],
        idMap: new Map(),
      };

      const mockedGroupsResults = {
        successful: [],
        failed: [],
        uuidMap: new Map(),
        idMap: new Map(),
      };

      session().state = {
        isLoggedIn: true,
        password: 'valid-token',
        region: 'eu',
      };

      vi.mocked(readComponentsFiles).mockResolvedValue(mockedSpaceData);

      // We need these mocks for the final expect handleComponents call
      vi.mocked(handleWhitelists).mockResolvedValue(mockedWhitelistResults);
      vi.mocked(handleTags).mockResolvedValue(mockedTagsResults);
      vi.mocked(handleComponentGroups).mockResolvedValue(mockedGroupsResults);

      await componentsCommand.parseAsync(['node', 'test', 'push', '--space', '12345']);

      // Reading phase.
      expect(readComponentsFiles).toHaveBeenCalledWith({
        from: '12345',
        path: undefined,
        space: '12345',
      });

      // Whitelist phase.
      expect(handleWhitelists).toHaveBeenCalledWith('12345', mockedSpaceData);

      // Tags phase.
      expect(handleTags).toHaveBeenCalledWith('12345', mockedSpaceData.internalTags, mockedWhitelistResults.processedTagIds);

      // Groups phase.
      expect(handleComponentGroups).toHaveBeenCalledWith('12345', mockedSpaceData.groups, mockedWhitelistResults.processedGroupUuids);

      // Components phase.
      expect(handleComponents).toHaveBeenCalledWith({
        space: '12345',
        spaceData: {
          components: mockedSpaceData.components,
          groups: [],
          presets: [],
          internalTags: [],
        },
        groupsUuidMap: new Map(),
        tagsIdMaps: new Map(),
        componentNameMap: new Map(),
      });
    });

    it('should push components with tags', async () => {
      const mockedSpaceData = {
        components: [{
          name: 'component-name',
          display_name: 'Component Name',
          created_at: '2021-08-09T12:00:00Z',
          updated_at: '2021-08-09T12:00:00Z',
          id: 12345,
          schema: { type: 'object' },
          color: null,
          internal_tags_list: ['tag1', 'tag2'],
          internal_tag_ids: [1, 2],
        }],
        groups: [],
        presets: [],
        internalTags: [{
          id: 1,
          name: 'tag1',
          color: '#000000',
        }, {
          id: 2,
          name: 'tag2',
          color: '#000000',
        }],
      };

      const mockedWhitelistResults = {
        successful: [],
        failed: [],
        groupsUuidMap: new Map(),
        tagsIdMap: new Map(),
        componentNameMap: new Map(),
        processedTagIds: new Set(),
        processedGroupUuids: new Set(),
        processedComponentNames: new Set(),
      };

      const mockedTagsResults = {
        successful: mockedSpaceData.internalTags,
        failed: [],
        idMap: new Map([[1, 1], [2, 2]]),
      };

      const mockedGroupsResults = {
        successful: [],
        failed: [],
        uuidMap: new Map(),
        idMap: new Map(),
      };

      session().state = {
        isLoggedIn: true,
        password: 'valid-token',
        region: 'eu',
      };

      vi.mocked(readComponentsFiles).mockResolvedValue(mockedSpaceData);

      // We need these mocks for the final expect handleComponents call
      vi.mocked(handleWhitelists).mockResolvedValue(mockedWhitelistResults);
      vi.mocked(handleTags).mockResolvedValue(mockedTagsResults);
      vi.mocked(handleComponentGroups).mockResolvedValue(mockedGroupsResults);

      await componentsCommand.parseAsync(['node', 'test', 'push', '--space', '12345']);

      // Tags phase.
      expect(handleTags).toHaveBeenCalledWith('12345', mockedSpaceData.internalTags, mockedWhitelistResults.processedTagIds);

      // Components phase.
      expect(handleComponents).toHaveBeenCalledWith({
        space: '12345',
        spaceData: {
          components: mockedSpaceData.components,
          groups: [],
          presets: [],
          internalTags: [{
            id: 1,
            name: 'tag1',
            color: '#000000',
          }, {
            id: 2,
            name: 'tag2',
            color: '#000000',
          }],
        },
        groupsUuidMap: new Map(),
        tagsIdMaps: new Map([...mockedTagsResults.idMap]),
        componentNameMap: new Map(),
      });
    });

    it('should push components with groups', async () => {
      const mockedSpaceData = {
        components: [{
          name: 'component-name',
          display_name: 'Component Name',
          created_at: '2021-08-09T12:00:00Z',
          updated_at: '2021-08-09T12:00:00Z',
          id: 12345,
          schema: { type: 'object' },
          color: null,
          group_uuid: 'group-uuid',
          group_id: 1,
        }],
        groups: [{
          id: 1,
          name: 'group-name',
          color: '#000000',
          uuid: 'group-uuid',
          parent_id: null,
          parent_uuid: null,
        }],
        presets: [],
        internalTags: [],
      };

      const mockedWhitelistResults = {
        successful: [],
        failed: [],
        groupsUuidMap: new Map(),
        tagsIdMap: new Map(),
        componentNameMap: new Map(),
        processedTagIds: new Set(),
        processedGroupUuids: new Set(),
        processedComponentNames: new Set(),
      };

      const mockedTagsResults = {
        successful: [],
        failed: [],
        idMap: new Map(),
      };

      const mockedGroupsResults = {
        successful: [
          {
            id: 1,
            name: 'group-name',
            color: '#000000',
            uuid: 'group-uuid',
            parent_id: null,
            parent_uuid: null,
          },
        ],
        failed: [],
        uuidMap: new Map([[1, 1]]),
        idMap: new Map(),
      };

      session().state = {
        isLoggedIn: true,
        password: 'valid-token',
        region: 'eu',
      };

      vi.mocked(readComponentsFiles).mockResolvedValue(mockedSpaceData);

      // We need these mocks for the final expect handleComponents call
      vi.mocked(handleWhitelists).mockResolvedValue(mockedWhitelistResults);
      vi.mocked(handleTags).mockResolvedValue(mockedTagsResults);
      vi.mocked(handleComponentGroups).mockResolvedValue(mockedGroupsResults);

      await componentsCommand.parseAsync(['node', 'test', 'push', '--space', '12345']);

      // Groups phase.
      expect(handleComponentGroups).toHaveBeenCalledWith('12345', mockedSpaceData.groups, mockedWhitelistResults.processedGroupUuids);

      // Components phase.
      expect(handleComponents).toHaveBeenCalledWith({
        space: '12345',
        spaceData: {
          components: mockedSpaceData.components,
          groups: [
            {
              id: 1,
              name: 'group-name',
              color: '#000000',
              uuid: 'group-uuid',
              parent_id: null,
              parent_uuid: null,
            },
          ],
          presets: [],
          internalTags: [],
        },
        groupsUuidMap: new Map([...mockedGroupsResults.uuidMap]),
        tagsIdMaps: new Map(),
        componentNameMap: new Map(),
      });
    });

    it('should push components with tags whitelist', async () => {
      const mockedSpaceData = {
        components: [{
          name: 'component-name',
          display_name: 'Component Name',
          created_at: '2021-08-09T12:00:00Z',
          updated_at: '2021-08-09T12:00:00Z',
          id: 12345,
          schema: {
            field1: {
              type: 'bloks',
              restrict_type: 'tags',
              component_tag_whitelist: [1, 2],
            },
          },
        }],
        groups: [],
        presets: [],
        internalTags: [],
      };

      const mockedWhitelistResults = {
        successful: [
          {
            id: 1,
            name: 'tag1',
            color: '#000000',
          },
          {
            id: 2,
            name: 'tag2',
            color: '#000000',
          },
        ],
        failed: [],
        groupsUuidMap: new Map<string, string>(),
        tagsIdMap: new Map<number, number>([[1, 1], [2, 2]]),
        componentNameMap: new Map<string, string>(),
        processedTagIds: new Set<number>([1, 2]),
        processedGroupUuids: new Set<string>(),
        processedComponentNames: new Set<string>(),
      };

      const mockedTagsResults = {
        successful: [],
        failed: [],
        idMap: new Map<number, number>(),
      };

      const mockedGroupsResults = {
        successful: [],
        failed: [],
        uuidMap: new Map(),
        idMap: new Map(),
      };

      session().state = {
        isLoggedIn: true,
        password: 'valid-token',
        region: 'eu',
      };

      vi.mocked(readComponentsFiles).mockResolvedValue(mockedSpaceData);

      // We need these mocks for the final expect handleComponents call
      vi.mocked(handleWhitelists).mockResolvedValue(mockedWhitelistResults);
      vi.mocked(handleTags).mockResolvedValue(mockedTagsResults);
      vi.mocked(handleComponentGroups).mockResolvedValue(mockedGroupsResults);

      await componentsCommand.parseAsync(['node', 'test', 'push', '--space', '12345']);

      expect(handleWhitelists).toHaveBeenCalledWith('12345', mockedSpaceData);

      // Tags phase.
      expect(handleTags).toHaveBeenCalledWith('12345', mockedSpaceData.internalTags, mockedWhitelistResults.processedTagIds);

      // Components phase.
      expect(handleComponents).toHaveBeenCalledWith({
        space: '12345',
        spaceData: {
          components: mockedSpaceData.components,
          groups: [],
          presets: [],
          internalTags: [],
        },
        groupsUuidMap: new Map(),
        tagsIdMaps: new Map([...mockedWhitelistResults.tagsIdMap]),
        componentNameMap: new Map(),
      });
    });

    it('should push components with group whitelist', async () => {
      const mockedSpaceData = {
        components: [{
          name: 'component-name',
          display_name: 'Component Name',
          created_at: '2021-08-09T12:00:00Z',
          updated_at: '2021-08-09T12:00:00Z',
          id: 12345,
          schema: {
            field1: {
              type: 'bloks',
              restrict_type: 'groups',
              component_group_uuid: 'group-uuid',
            },
          },
        }],
        groups: [{
          id: 1,
          name: 'group-name',
          color: '#000000',
          uuid: 'group-uuid',
          parent_id: null,
          parent_uuid: null,
        }],
        presets: [],
        internalTags: [],
      };

      const mockedWhitelistResults = {
        successful: [],
        failed: [],
        groupsUuidMap: new Map(),
        tagsIdMap: new Map(),
        componentNameMap: new Map(),
        processedTagIds: new Set(),
        processedGroupUuids: new Set(),
        processedComponentNames: new Set(),
      };

      const mockedTagsResults = {
        successful: [],
        failed: [],
        idMap: new Map(),
      };

      const mockedGroupsResults = {
        successful: [],
        failed: [],
        uuidMap: new Map(),
        idMap: new Map(),
      };

      session().state = {
        isLoggedIn: true,
        password: 'valid-token',
        region: 'eu',
      };

      vi.mocked(readComponentsFiles).mockResolvedValue(mockedSpaceData);

      // We need these mocks for the final expect handleComponents call
      vi.mocked(handleWhitelists).mockResolvedValue(mockedWhitelistResults);
      vi.mocked(handleTags).mockResolvedValue(mockedTagsResults);
      vi.mocked(handleComponentGroups).mockResolvedValue(mockedGroupsResults);

      await componentsCommand.parseAsync(['node', 'test', 'push', '--space', '12345']);

      // Groups phase.
      expect(handleComponentGroups).toHaveBeenCalledWith('12345', mockedSpaceData.groups, mockedWhitelistResults.processedGroupUuids);

      // Components phase.
      expect(handleComponents).toHaveBeenCalledWith({
        space: '12345',
        spaceData: {
          components: mockedSpaceData.components,
          groups: [
            {
              id: 1,
              name: 'group-name',
              color: '#000000',
              uuid: 'group-uuid',
              parent_id: null,
              parent_uuid: null,
            },
          ],
          presets: [],
          internalTags: [],
        },
        groupsUuidMap: new Map([...mockedGroupsResults.uuidMap]),
        tagsIdMaps: new Map(),
        componentNameMap: new Map(),
      });
    });

    it('should push components with component whitelist', async () => {
      const mockedSpaceData = {
        components: [
          {
            name: 'component-tags',
            display_name: 'Component Tags',
            created_at: '2021-08-09T12:00:00Z',
            updated_at: '2021-08-09T12:00:00Z',
            id: 12346,
            schema: { type: 'object' },
          },
          {
            name: 'component-name',
            display_name: 'Component Name',
            created_at: '2021-08-09T12:00:00Z',
            updated_at: '2021-08-09T12:00:00Z',
            id: 12345,
            schema: {
              field1: {
                type: 'bloks',
                restrict_type: 'component',
                restrict_components: true,
                component_whitelist: ['component-tags'],
              },
            },
          },
        ],
        groups: [],
        presets: [],
        internalTags: [],
      };

      const mockedWhitelistResults = {
        successful: [],
        failed: [],
        groupsUuidMap: new Map(),
        tagsIdMap: new Map(),
        componentNameMap: new Map([
          ['component-tags', 'component-tags'],
        ]),
        processedTagIds: new Set(),
        processedGroupUuids: new Set(),
        processedComponentNames: new Set([
          'component-tags',
        ]),
      };

      const mockedTagsResults = {
        successful: [],
        failed: [],
        idMap: new Map(),
      };

      const mockedGroupsResults = {
        successful: [],
        failed: [],
        uuidMap: new Map(),
        idMap: new Map(),
      };

      session().state = {
        isLoggedIn: true,
        password: 'valid-token',
        region: 'eu',
      };

      vi.mocked(readComponentsFiles).mockResolvedValue(mockedSpaceData);

      // We need these mocks for the final expect handleComponents call
      vi.mocked(handleWhitelists).mockResolvedValue(mockedWhitelistResults);
      vi.mocked(handleTags).mockResolvedValue(mockedTagsResults);
      vi.mocked(handleComponentGroups).mockResolvedValue(mockedGroupsResults);

      await componentsCommand.parseAsync(['node', 'test', 'push', '--space', '12345']);

      // Groups phase.
      expect(handleComponentGroups).toHaveBeenCalledWith('12345', mockedSpaceData.groups, mockedWhitelistResults.processedGroupUuids);

      // Components phase.
      expect(handleComponents).toHaveBeenCalledWith({
        space: '12345',
        spaceData: {
          components: [mockedSpaceData.components[1]], // Only the component with the whitelist
          groups: [],
          presets: [],
          internalTags: [],
        },
        groupsUuidMap: new Map(),
        tagsIdMaps: new Map(),
        componentNameMap: new Map([
          ['component-tags', 'component-tags'],
        ]),
      });
    });

    describe('component name flag', () => {
      it('should push components matching the component name', async () => {
        const mockedSpaceData = {
          components: [
            {
              name: 'component-name',
              display_name: 'Component Name',
              created_at: '2021-08-09T12:00:00Z',
              updated_at: '2021-08-09T12:00:00Z',
              id: 12345,
              schema: { type: 'object' },
              color: null,
              internal_tags_list: [],
              internal_tag_ids: [],
            },
          ],
        };

        session().state = {
          isLoggedIn: true,
          password: 'valid-token',
          region: 'eu',
        };

        vi.mocked(readComponentsFiles).mockResolvedValue(mockedSpaceData);

        await componentsCommand.parseAsync(['node', 'test', 'push', 'component-name', '--space', '12345']);

        expect(filterSpaceDataByComponent).toHaveBeenCalledWith(mockedSpaceData, 'component-name');
      });

      it('should show error if no components match the component name', async () => {
        session().state = {
          isLoggedIn: true,
          password: 'valid-token',
          region: 'eu',
        };

        vi.mocked(filterSpaceDataByComponent).mockImplementation(() => {
          return {
            components: [],
            groups: [],
            presets: [],
            internalTags: [],
          };
        });

        await componentsCommand.parseAsync(['node', 'test', 'push', 'component-name', '--space', '12345']);

        expect(konsola.error).toHaveBeenCalledWith(new CommandError('Component "component-name" not found.'), false);
      });
    });

    describe('filter flag', () => {
      it('should push components matching the filter pattern', async () => {
        const mockedSpaceData = {
          components: [
            {
              name: 'page',
              display_name: 'Page',
              created_at: '2021-08-09T12:00:00Z',
              updated_at: '2021-08-09T12:00:00Z',
              id: 12345,
              schema: { type: 'object' },
              color: null,
              internal_tags_list: [],
              internal_tag_ids: [],
            },
            {
              name: 'blog-post',
              display_name: 'Blog Post',
              created_at: '2021-08-09T12:00:00Z',
              updated_at: '2021-08-09T12:00:00Z',
              id: 12346,
              schema: { type: 'object' },
              color: null,
              internal_tags_list: [],
              internal_tag_ids: [],
            },
          ],
          groups: [],
          presets: [],
          internalTags: [],
        };

        const mockedWhitelistResults = {
          successful: [],
          failed: [],
          groupsUuidMap: new Map<string, string>(),
          tagsIdMap: new Map<number, number>(),
          componentNameMap: new Map<string, string>(),
          processedTagIds: new Set<number>(),
          processedGroupUuids: new Set<string>(),
          processedComponentNames: new Set<string>(),
        };

        const mockedTagsResults = {
          successful: [],
          failed: [],
          idMap: new Map<number, number>(),
        };

        const mockedGroupsResults = {
          successful: [],
          failed: [],
          uuidMap: new Map<string, string>(),
          idMap: new Map<number, number>(),
        };

        session().state = {
          isLoggedIn: true,
          password: 'valid-token',
          region: 'eu',
        };

        vi.mocked(readComponentsFiles).mockResolvedValue(mockedSpaceData);

        // We need these mocks for the final expect handleComponents call
        vi.mocked(handleWhitelists).mockResolvedValue(mockedWhitelistResults);
        vi.mocked(handleTags).mockResolvedValue(mockedTagsResults);
        vi.mocked(handleComponentGroups).mockResolvedValue(mockedGroupsResults);

        await componentsCommand.parseAsync(['node', 'test', 'push', '--space', '12345', '--filter', 'blog-*']);

        // Components phase - should only include the blog-post component
        expect(filterSpaceDataByPattern).toHaveBeenCalledWith(mockedSpaceData, 'blog-*');
      });

      it('should handle no components matching filter pattern', async () => {
        const mockedSpaceData = {
          components: [
            {
              name: 'page',
              display_name: 'Page',
              created_at: '2021-08-09T12:00:00Z',
              updated_at: '2021-08-09T12:00:00Z',
              id: 12345,
              schema: { type: 'object' },
              color: null,
              internal_tags_list: [],
              internal_tag_ids: [],
            },
          ],
          groups: [],
          presets: [],
          internalTags: [],
        };

        session().state = {
          isLoggedIn: true,
          password: 'valid-token',
          region: 'eu',
        };

        vi.mocked(readComponentsFiles).mockResolvedValue(mockedSpaceData);
        vi.mocked(konsola.error).mockImplementation(() => {});
        vi.mocked(filterSpaceDataByPattern).mockImplementation(() => {
          return {
            components: [],
            groups: [],
            presets: [],
            internalTags: [],
          };
        });
        await componentsCommand.parseAsync(['node', 'test', 'push', '--space', '12345', '--filter', 'blog-*']);

        // Should show error message when no components match the pattern
        expect(konsola.error).toHaveBeenCalledWith(new CommandError('No components found matching pattern "blog-*".'), false);

        // Components phase should not be called
        expect(handleComponents).not.toHaveBeenCalled();
      });
    });
  });
});
