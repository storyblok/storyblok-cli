import { session } from '../../../session';
import { CommandError, konsola } from '../../../utils';
import { readComponentsFiles } from './actions';
import { colorPalette } from '../../../constants';
import chalk from 'chalk';

// Import the main components module first to ensure proper initialization
import '../index';
import { componentsCommand } from '../command';
import { handleComponentGroups, handleComponents, handleTags, handleWhitelists } from './operations';

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
      });

      // Whitelist phase.
      expect(handleWhitelists).toHaveBeenCalledWith('12345', 'valid-token', 'eu', mockedSpaceData);

      // Tags phase.
      expect(handleTags).toHaveBeenCalledWith('12345', 'valid-token', 'eu', mockedSpaceData.internalTags, mockedWhitelistResults.processedTagIds);

      // Groups phase.
      expect(handleComponentGroups).toHaveBeenCalledWith('12345', 'valid-token', 'eu', mockedSpaceData.groups, mockedWhitelistResults.processedGroupUuids);

      // Components phase.
      expect(handleComponents).toHaveBeenCalledWith({
        space: '12345',
        password: 'valid-token',
        region: 'eu',
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
      expect(handleTags).toHaveBeenCalledWith('12345', 'valid-token', 'eu', mockedSpaceData.internalTags, mockedWhitelistResults.processedTagIds);

      // Components phase.
      expect(handleComponents).toHaveBeenCalledWith({
        space: '12345',
        password: 'valid-token',
        region: 'eu',
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
      expect(handleComponentGroups).toHaveBeenCalledWith('12345', 'valid-token', 'eu', mockedSpaceData.groups, mockedWhitelistResults.processedGroupUuids);

      // Components phase.
      expect(handleComponents).toHaveBeenCalledWith({
        space: '12345',
        password: 'valid-token',
        region: 'eu',
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

      const handleComponentsSpy = vi.fn().mockImplementation((args) => {
        console.log('handleComponents called with:', JSON.stringify(args, null, 2));
        return Promise.resolve({ successful: [], failed: [] });
      });

      vi.mocked(readComponentsFiles).mockResolvedValue(mockedSpaceData);

      // We need these mocks for the final expect handleComponents call
      vi.mocked(handleWhitelists).mockResolvedValue(mockedWhitelistResults);
      vi.mocked(handleTags).mockResolvedValue(mockedTagsResults);
      vi.mocked(handleComponentGroups).mockResolvedValue(mockedGroupsResults);
      vi.mocked(handleComponents).mockImplementation(handleComponentsSpy);

      await componentsCommand.parseAsync(['node', 'test', 'push', '--space', '12345']);

      console.log('handleComponents mock calls:', vi.mocked(handleComponents).mock.calls);
      console.log('handleComponents mock results:', vi.mocked(handleComponents).mock.results);

      expect(handleWhitelists).toHaveBeenCalledWith('12345', 'valid-token', 'eu', mockedSpaceData);

      // Tags phase.
      expect(handleTags).toHaveBeenCalledWith('12345', 'valid-token', 'eu', mockedSpaceData.internalTags, mockedWhitelistResults.processedTagIds);

      // Components phase.
      expect(handleComponents).toHaveBeenCalledWith({
        space: '12345',
        password: 'valid-token',
        region: 'eu',
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
  });
});
