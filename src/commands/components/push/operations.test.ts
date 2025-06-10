import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  filterSpaceDataByComponent,
  filterSpaceDataByPattern,
  handleComponentGroups,
  handleComponents,
  handleTags,
  handleWhitelists,
} from './operations';
import { upsertComponent, upsertComponentGroup, upsertComponentInternalTag, upsertComponentPreset } from './actions';
import type { SpaceComponentGroup, SpaceData } from '../constants';

// Mock the actions module
vi.mock('./actions', () => ({
  upsertComponentInternalTag: vi.fn(),
  upsertComponentGroup: vi.fn(),
  upsertComponent: vi.fn(),
  upsertComponentPreset: vi.fn(),
}));

// Mock the spinner
vi.mock('@topcli/spinner', () => ({
  Spinner: vi.fn().mockImplementation(() => ({
    start: vi.fn(),
    succeed: vi.fn(),
    failed: vi.fn(),
    elapsedTime: 100,
  })),
}));

describe('operations', () => {
  const mockSpace = 'test-space';

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('handleTags', () => {
    it('should successfully process tags', async () => {
      const mockTags = [
        { id: 1, name: 'tag1' },
        { id: 2, name: 'tag2' },
      ];

      // Mock successful upsert
      vi.mocked(upsertComponentInternalTag).mockResolvedValue(undefined);

      const result = await handleTags(mockSpace, mockTags);

      expect(upsertComponentInternalTag).toHaveBeenCalledTimes(2);
      expect(upsertComponentInternalTag).toHaveBeenCalledWith(mockSpace, mockTags[0]);
      expect(upsertComponentInternalTag).toHaveBeenCalledWith(mockSpace, mockTags[1]);
      expect(result.failed).toHaveLength(0);
    });

    it('should handle failed tag processing', async () => {
      const mockTags = [
        { id: 1, name: 'tag1' },
        { id: 2, name: 'tag2' },
      ];

      // Mock first tag succeeding and second failing
      vi.mocked(upsertComponentInternalTag)
        .mockResolvedValueOnce(undefined)
        .mockRejectedValueOnce(new Error('API Error'));

      const result = await handleTags(mockSpace, mockTags);

      expect(upsertComponentInternalTag).toHaveBeenCalledTimes(2);
      expect(result.failed).toHaveLength(1);
      expect(result.failed[0]).toEqual({
        name: 'tag2',
        error: new Error('API Error'),
      });
    });
  });

  describe('handleComponentGroups', () => {
    const mockGroups: SpaceComponentGroup[] = [
      {
        name: 'Folder A',
        id: 487969,
        uuid: 'a6e35ba1-505e-4941-8bb2-eaac3d0a26a4',
        parent_id: null,
        parent_uuid: null,
      },
      {
        name: 'Folder B',
        id: 489043,
        uuid: '558e0d2a-d1d2-4753-9a18-a37d3bb6f505',
        parent_id: 0,
        parent_uuid: '',
      },
      {
        name: 'Folder C',
        id: 489044,
        uuid: '80e208d8-985d-461d-9ac2-79edb0f746c8',
        parent_id: 489043,
        parent_uuid: '558e0d2a-d1d2-4753-9a18-a37d3bb6f505',
      },
      {
        name: 'Folder D',
        id: 492996,
        uuid: '71e33aad-4238-41e2-a27c-ccd3105cbfc3',
        parent_id: 489044,
        parent_uuid: '80e208d8-985d-461d-9ac2-79edb0f746c8',
      },
    ];

    it('should process groups in hierarchical order', async () => {
      // Mock responses for each group with new UUIDs and IDs
      const mockResponses: Record<string, SpaceComponentGroup> = {
        'Folder A': {
          name: 'Folder A',
          id: 1001,
          uuid: 'new-uuid-a',
          parent_id: 0,
          parent_uuid: '',
        },
        'Folder B': {
          name: 'Folder B',
          id: 1002,
          uuid: 'new-uuid-b',
          parent_id: 0,
          parent_uuid: '',
        },
        'Folder C': {
          name: 'Folder C',
          id: 1003,
          uuid: 'new-uuid-c',
          parent_id: 1002,
          parent_uuid: 'new-uuid-b',
        },
        'Folder D': {
          name: 'Folder D',
          id: 1004,
          uuid: 'new-uuid-d',
          parent_id: 1003,
          parent_uuid: 'new-uuid-c',
        },
      };

      // Mock the upsertComponentGroup function to return appropriate responses
      vi.mocked(upsertComponentGroup).mockImplementation(async (space, group) => {
        return mockResponses[group.name];
      });

      const result = await handleComponentGroups(mockSpace, mockGroups);

      // Verify successful processing
      expect(result.successful).toEqual(['Folder A', 'Folder B', 'Folder C', 'Folder D']);
      expect(result.failed).toHaveLength(0);

      // Verify correct order of processing and parent updates
      const calls = vi.mocked(upsertComponentGroup).mock.calls;

      // First two calls should be root folders (order doesn't matter)
      const rootCalls = calls.slice(0, 2).map(call => call[1].name);
      expect(rootCalls).toContain('Folder A');
      expect(rootCalls).toContain('Folder B');

      // Third call should be Folder C with updated parent references
      expect(calls[2][1]).toEqual(expect.objectContaining({
        name: 'Folder C',
        parent_id: 1002,
        parent_uuid: 'new-uuid-b',
      }));

      // Fourth call should be Folder D with updated parent references
      expect(calls[3][1]).toEqual(expect.objectContaining({
        name: 'Folder D',
        parent_id: 1003,
        parent_uuid: 'new-uuid-c',
      }));

      // Verify UUID and ID mappings
      expect(result.uuidMap.get('a6e35ba1-505e-4941-8bb2-eaac3d0a26a4')).toBe('new-uuid-a');
      expect(result.uuidMap.get('558e0d2a-d1d2-4753-9a18-a37d3bb6f505')).toBe('new-uuid-b');
      expect(result.uuidMap.get('80e208d8-985d-461d-9ac2-79edb0f746c8')).toBe('new-uuid-c');
      expect(result.uuidMap.get('71e33aad-4238-41e2-a27c-ccd3105cbfc3')).toBe('new-uuid-d');

      expect(result.idMap.get(487969)).toBe(1001);
      expect(result.idMap.get(489043)).toBe(1002);
      expect(result.idMap.get(489044)).toBe(1003);
      expect(result.idMap.get(492996)).toBe(1004);
    });

    it('should handle failures and continue processing', async () => {
      // Mock Folder B to fail
      vi.mocked(upsertComponentGroup).mockImplementation(async (space, group) => {
        if (group.name === 'Folder B') {
          throw new Error('Failed to create Folder B');
        }
        return {
          ...group,
          id: 1001,
          uuid: 'new-uuid',
        };
      });

      const result = await handleComponentGroups(mockSpace, mockGroups);

      // Verify Folder B failed but others processed
      expect(result.failed).toHaveLength(1);
      expect(result.failed[0]).toEqual({
        name: 'Folder B',
        error: new Error('Failed to create Folder B'),
      });

      // Verify Folder A was processed
      expect(result.successful).toContain('Folder A');
    });

    it('should handle empty groups array', async () => {
      const result = await handleComponentGroups(mockSpace, []);

      expect(result.successful).toHaveLength(0);
      expect(result.failed).toHaveLength(0);
      expect(result.uuidMap.size).toBe(0);
      expect(result.idMap.size).toBe(0);
    });
  });

  describe('handleComponents', () => {
    const mockComponents = [
      {
        name: 'Hero',
        id: 123,
        display_name: 'Hero',
        created_at: '2024-01-01',
        updated_at: '2024-01-01',
        schema: {},
        component_group_uuid: 'a6e35ba1-505e-4941-8bb2-eaac3d0a26a4',
        internal_tag_ids: ['1', '2'],
        internal_tags_list: [],
        color: null,
      },
      {
        name: 'Footer',
        id: 124,
        display_name: 'Footer',
        created_at: '2024-01-01',
        updated_at: '2024-01-01',
        component_group_uuid: '558e0d2a-d1d2-4753-9a18-a37d3bb6f505',
        internal_tag_ids: ['2'],
        internal_tags_list: [],
        color: null,
      },
    ];

    const mockInternalTags = [
      { id: 1, name: 'tag1' },
      { id: 2, name: 'tag2' },
    ];

    const mockPresets = [
      {
        id: 1,
        name: 'Hero Preset',
        component_id: 123,
        preset: { title: 'Hello' },
        space_id: 1,
        created_at: '2024-01-01',
        updated_at: '2024-01-01',
        image: '',
        color: '',
        icon: '',
        description: '',
      },
    ];

    const mockGroups = [
      {
        name: 'Folder A',
        id: 487969,
        uuid: 'a6e35ba1-505e-4941-8bb2-eaac3d0a26a4',
      },
      {
        name: 'Folder B',
        id: 489043,
        uuid: '558e0d2a-d1d2-4753-9a18-a37d3bb6f505',
      },
    ];

    const mockSpaceData = {
      components: mockComponents,
      internalTags: mockInternalTags,
      presets: mockPresets,
      groups: mockGroups,
    };

    const mockGroupsUuidMap = new Map([
      ['a6e35ba1-505e-4941-8bb2-eaac3d0a26a4', 'new-uuid-a'],
      ['558e0d2a-d1d2-4753-9a18-a37d3bb6f505', 'new-uuid-b'],
    ]);

    const mockTagsIdMap = new Map([
      [1, 101],
      [2, 102],
    ]);

    it('should process components with mapped group UUIDs and tag IDs', async () => {
      // Mock successful component update
      vi.mocked(upsertComponent).mockImplementation(async (space, component) => ({
        ...component,
        id: component.id + 1000, // Just to make it different
      }));

      // Mock successful preset update
      vi.mocked(upsertComponentPreset).mockResolvedValue(mockPresets[0]);

      const result = await handleComponents({
        space: mockSpace,
        spaceData: mockSpaceData,
        groupsUuidMap: mockGroupsUuidMap,
        tagsIdMaps: mockTagsIdMap,
      });

      // Verify successful processing
      expect(result.successful).toEqual(['Hero', 'Footer']);
      expect(result.failed).toHaveLength(0);

      // Verify component updates
      const componentCalls = vi.mocked(upsertComponent).mock.calls;
      // We expect 2 calls total: one for each component because they don't have component whitelists
      expect(componentCalls).toHaveLength(2);

      // First pass: Initial component updates
      // Verify first component (Hero)
      expect(componentCalls[0][1]).toEqual(expect.objectContaining({
        name: 'Hero',
        component_group_uuid: 'new-uuid-a',
        internal_tag_ids: ['101', '102'],
      }));

      // Verify second component (Footer)
      expect(componentCalls[1][1]).toEqual(expect.objectContaining({
        name: 'Footer',
        component_group_uuid: 'new-uuid-b',
        internal_tag_ids: ['102'],
      }));

      // Verify preset update
      const presetCalls = vi.mocked(upsertComponentPreset).mock.calls;
      expect(presetCalls).toHaveLength(1);
      expect(presetCalls[0][1]).toEqual(expect.objectContaining({
        name: 'Hero Preset',
        component_id: 1123, // Original 123 + 1000
      }));
    });

    it('should handle component update failures', async () => {
      // Mock Hero component failing
      vi.mocked(upsertComponent).mockImplementation(async (space, component) => {
        if (component.name === 'Hero') {
          throw new Error('Failed to update Hero component');
        }
        return {
          ...component,
          id: component.id + 1000,
        };
      });

      const result = await handleComponents({
        space: mockSpace,
        spaceData: mockSpaceData,
        groupsUuidMap: mockGroupsUuidMap,
        tagsIdMaps: mockTagsIdMap,
      });

      // Verify one failure and one success
      expect(result.successful).toEqual(['Footer']);
      // We expect 2 failures, one for the Hero component and one for the preset
      expect(result.failed).toHaveLength(2);
      expect(result.failed[0]).toEqual({
        name: 'Hero',
        error: new Error('Failed to update Hero component'),
      });
    });

    it('should handle preset update failures', async () => {
      // Mock successful component update but failed preset
      vi.mocked(upsertComponent).mockImplementation(async (space, component) => ({
        ...component,
        id: component.id + 1000,
      }));

      vi.mocked(upsertComponentPreset).mockRejectedValue(new Error('Failed to update preset'));

      const result = await handleComponents({
        space: mockSpace,
        spaceData: mockSpaceData,
        groupsUuidMap: mockGroupsUuidMap,
        tagsIdMaps: mockTagsIdMap,
      });

      // Verify components succeeded but preset failed
      expect(result.successful).toEqual(['Hero', 'Footer']);
      expect(result.failed).toHaveLength(1);
      expect(result.failed[0]).toEqual({
        name: 'Hero Preset',
        error: new Error('Failed to update preset'),
      });
    });
  });

  describe('filterSpaceDataByPattern', () => {
    const mockSpaceData: SpaceData = {
      components: [
        {
          name: 'component-tags',
          id: 123,
          display_name: 'Component Tags',
          created_at: '2024-01-01',
          updated_at: '2024-01-01',
          schema: {},
          component_group_uuid: 'group-a-uuid',
          internal_tag_ids: ['1', '2'],
          internal_tags_list: [],
          color: null,
        },
        {
          name: 'component-inside-folder-a',
          id: 124,
          display_name: 'Component Inside Folder A',
          created_at: '2024-01-01',
          updated_at: '2024-01-01',
          schema: {},
          component_group_uuid: 'group-b-uuid',
          internal_tag_ids: ['2'],
          internal_tags_list: [],
          color: null,
        },
        {
          name: 'component-inside-deep-folder',
          id: 125,
          display_name: 'Component Inside Deep Folder',
          created_at: '2024-01-01',
          updated_at: '2024-01-01',
          schema: {},
          component_group_uuid: 'group-c-uuid',
          internal_tag_ids: ['1'],
          internal_tags_list: [],
          color: null,
        },
        {
          name: 'old-component-inside-old-folder',
          id: 126,
          display_name: 'Old Component Inside Old Folder',
          created_at: '1999-01-01',
          updated_at: '1999-01-01',
          schema: {},
          component_group_uuid: 'group-old-uuid',
          internal_tag_ids: [],
          internal_tags_list: [],
          color: null,
        },
      ],
      groups: [
        {
          name: 'Group A',
          id: 1,
          uuid: 'group-a-uuid',
          parent_id: 0,
          parent_uuid: '',
        },
        {
          name: 'Group B',
          id: 2,
          uuid: 'group-b-uuid',
          parent_id: 1,
          parent_uuid: 'group-a-uuid',
        },
        {
          name: 'Group C',
          id: 3,
          uuid: 'group-c-uuid',
          parent_id: 2,
          parent_uuid: 'group-b-uuid',
        },
        {
          name: 'Group Old',
          id: 99,
          uuid: 'group-old-uuid',
          parent_id: null,
          // old root groups have parent uuid equal to own uuid
          parent_uuid: 'group-old-uuid',
        },
      ],
      presets: [
        {
          id: 1,
          name: 'Tags Preset',
          component_id: 123,
          preset: { title: 'Hello' },
          space_id: 1,
          created_at: '2024-01-01',
          updated_at: '2024-01-01',
          image: '',
          color: '',
          icon: '',
          description: '',
        },
      ],
      internalTags: [
        { id: 1, name: 'tag1' },
        { id: 2, name: 'tag2' },
      ],
    };

    it('should match exact component name', () => {
      const result = filterSpaceDataByPattern(mockSpaceData, 'component-tags');

      expect(result.components).toHaveLength(1);
      expect(result.components[0].name).toBe('component-tags');
      expect(result.internalTags).toHaveLength(2); // Should have both tags
      expect(result.presets).toHaveLength(1); // Should have the preset
      expect(result.groups).toHaveLength(1); // Should have Group A
    });

    it('should match components using wildcard pattern', () => {
      const result = filterSpaceDataByPattern(mockSpaceData, 'component-inside-*');

      expect(result.components).toHaveLength(2);
      expect(result.components.map(c => c.name)).toEqual([
        'component-inside-folder-a',
        'component-inside-deep-folder',
      ]);
      expect(result.internalTags).toHaveLength(2); // Should have both tags as they're used
      expect(result.presets).toHaveLength(0); // No presets for these components
      expect(result.groups).toHaveLength(3); // Should have all groups due to hierarchy
    });

    it('should handle no matches', () => {
      const result = filterSpaceDataByPattern(mockSpaceData, 'non-existent-*');

      expect(result.components).toHaveLength(0);
      expect(result.internalTags).toHaveLength(0);
      expect(result.presets).toHaveLength(0);
      expect(result.groups).toHaveLength(0);
    });

    it('should escape special regex characters in pattern', () => {
      const result = filterSpaceDataByPattern(mockSpaceData, 'component-tags.+$');

      expect(result.components).toHaveLength(0); // Should not match as it's treated as literal
    });

    it('should handle old root groups', () => {
      const result = filterSpaceDataByPattern(mockSpaceData, 'old-component-inside-old-folder');

      expect(result.components).toHaveLength(1);
      expect(result.components[0].name).toBe('old-component-inside-old-folder');
      expect(result.internalTags).toHaveLength(0);
      expect(result.presets).toHaveLength(0);
      expect(result.groups).toHaveLength(1);
      expect(result.groups[0].uuid).toBe('group-old-uuid');
    });
  });

  describe('filterSpaceDataByComponent', () => {
    const mockSpaceData: SpaceData = {
      components: [
        {
          name: 'component-tags',
          id: 123,
          display_name: 'Component Tags',
          created_at: '2024-01-01',
          updated_at: '2024-01-01',
          schema: {},
          component_group_uuid: 'group-a-uuid',
          internal_tag_ids: ['1', '2'],
          internal_tags_list: [],
          color: null,
        },
        {
          name: 'component-inside-folder-a',
          id: 124,
          display_name: 'Component Inside Folder A',
          created_at: '2024-01-01',
          updated_at: '2024-01-01',
          schema: {},
          component_group_uuid: 'group-b-uuid',
          internal_tag_ids: ['2'],
          internal_tags_list: [],
          color: null,
        },
        {
          name: 'old-component-inside-old-folder',
          id: 126,
          display_name: 'Old Component Inside Old Folder',
          created_at: '1999-01-01',
          updated_at: '1999-01-01',
          schema: {},
          component_group_uuid: 'group-old-uuid',
          internal_tag_ids: [],
          internal_tags_list: [],
          color: null,
        },
      ],
      groups: [
        {
          name: 'Group A',
          id: 1,
          uuid: 'group-a-uuid',
          parent_id: 0,
          parent_uuid: '',
        },
        {
          name: 'Group B',
          id: 2,
          uuid: 'group-b-uuid',
          parent_id: 1,
          parent_uuid: 'group-a-uuid',
        },
        {
          name: 'Group Old',
          id: 99,
          uuid: 'group-old-uuid',
          parent_id: null,
          // old root groups have parent uuid equal to own uuid
          parent_uuid: 'group-old-uuid',
        },
      ],
      presets: [
        {
          id: 1,
          name: 'Tags Preset',
          component_id: 123,
          preset: { title: 'Hello' },
          space_id: 1,
          created_at: '2024-01-01',
          updated_at: '2024-01-01',
          image: '',
          color: '',
          icon: '',
          description: '',
        },
      ],
      internalTags: [
        { id: 1, name: 'tag1' },
        { id: 2, name: 'tag2' },
      ],
    };

    it('should filter data for exact component name match', () => {
      const result = filterSpaceDataByComponent(mockSpaceData, 'component-tags');

      expect(result.components).toHaveLength(1);
      expect(result.components[0].name).toBe('component-tags');
      expect(result.internalTags).toHaveLength(2); // Should include both tags as they're used
      expect(result.presets).toHaveLength(1); // Should include the preset for this component
      expect(result.groups).toHaveLength(1); // Should only include Group A
    });

    it('should filter data for component with single tag and no presets', () => {
      const result = filterSpaceDataByComponent(mockSpaceData, 'component-inside-folder-a');

      expect(result.components).toHaveLength(1);
      expect(result.components[0].name).toBe('component-inside-folder-a');
      expect(result.internalTags).toHaveLength(1); // Should only include tag2
      expect(result.presets).toHaveLength(0); // Should have no presets
      expect(result.groups).toHaveLength(2); // Should include both groups due to hierarchy
    });

    it('should return empty data for non-existent component', () => {
      const result = filterSpaceDataByComponent(mockSpaceData, 'non-existent-component');

      expect(result.components).toHaveLength(0);
      expect(result.internalTags).toHaveLength(0);
      expect(result.presets).toHaveLength(0);
      expect(result.groups).toHaveLength(0);
    });

    it('should handle component with no tags or groups', () => {
      const testData: SpaceData = {
        ...mockSpaceData,
        components: [
          {
            name: 'standalone-component',
            id: 999,
            display_name: 'Standalone Component',
            created_at: '2024-01-01',
            updated_at: '2024-01-01',
            schema: {},
            component_group_uuid: '',
            internal_tag_ids: [],
            internal_tags_list: [],
            color: null,
          },
        ],
      };

      const result = filterSpaceDataByComponent(testData, 'standalone-component');

      expect(result.components).toHaveLength(1);
      expect(result.components[0].name).toBe('standalone-component');
      expect(result.internalTags).toHaveLength(0);
      expect(result.presets).toHaveLength(0);
      expect(result.groups).toHaveLength(0);
    });

    it('should handle old root groups', () => {
      const result = filterSpaceDataByComponent(mockSpaceData, 'old-component-inside-old-folder');

      expect(result.components).toHaveLength(1);
      expect(result.components[0].name).toBe('old-component-inside-old-folder');
      expect(result.internalTags).toHaveLength(0);
      expect(result.presets).toHaveLength(0);
      expect(result.groups).toHaveLength(1);
      expect(result.groups[0].uuid).toBe('group-old-uuid');
    });
  });

  describe('handleWhitelists', () => {
    const mockSpaceData: SpaceData = {
      components: [
        {
          name: 'component-component-whitelist',
          id: 123,
          display_name: 'Component Component Whitelist',
          created_at: '2024-01-01',
          updated_at: '2024-01-01',
          schema: {
            tab1: {
              type: 'tab',
              display_name: 'Tab 1',
              keys: ['field1'],
            },
            field1: {
              type: 'bloks',
              restrict_type: 'components',
              component_whitelist: ['component-tags'],
            },
          },
          component_group_uuid: 'group-a-uuid',
          internal_tag_ids: [],
          internal_tags_list: [],
          color: null,
        },
        {
          name: 'component-tags',
          id: 124,
          display_name: 'Component Tags',
          created_at: '2024-01-01',
          updated_at: '2024-01-01',
          schema: {
            tab1: {
              type: 'tab',
              display_name: 'Tab 1',
              keys: ['field1'],
            },
            field1: {
              type: 'bloks',
              restrict_type: 'tags',
              component_tag_whitelist: [1, 2],
            },
            field2: {
              type: 'bloks',
              restrict_type: 'groups',
              component_group_whitelist: ['group-a-uuid', 'group-b-uuid', 'group-old-uuid'],
            },
          },
          component_group_uuid: 'group-b-uuid',
          internal_tag_ids: ['1', '2'],
          internal_tags_list: [],
          color: null,
        },
      ],
      groups: [
        {
          name: 'Group A',
          id: 1,
          uuid: 'group-a-uuid',
          parent_id: 0,
          parent_uuid: '',
        },
        {
          name: 'Group B',
          id: 2,
          uuid: 'group-b-uuid',
          parent_id: 1,
          parent_uuid: 'group-a-uuid',
        },
        {
          name: 'Old Group',
          id: 99,
          uuid: 'group-old-uuid',
          parent_id: null,
          // old root groups have parent uuid equal to own uuid
          parent_uuid: 'group-old-uuid',
        },
      ],
      presets: [],
      internalTags: [
        { id: 1, name: 'tag1' },
        { id: 2, name: 'tag2' },
      ],
    };

    beforeEach(() => {
      vi.clearAllMocks();
    });

    it('should process dependencies in correct order: tags -> groups -> components', async () => {
      // Mock successful responses
      vi.mocked(upsertComponentInternalTag).mockImplementation(async (space, tag) => ({
        ...tag,
        id: tag.id + 1000, // New ID = old ID + 1000
      }));

      vi.mocked(upsertComponentGroup).mockImplementation(async (space, group) => ({
        ...group,
        uuid: `new-${group.uuid}`, // New UUID = new-{old-uuid}
        id: group.id + 1000, // New ID = old ID + 1000
      }));

      vi.mocked(upsertComponent).mockImplementation(async (space, component) => ({
        ...component,
        id: component.id + 1000, // New ID = old ID + 1000
      }));

      const results = await handleWhitelists(mockSpace, mockSpaceData);

      // Verify order of operations through mock calls
      const allCalls = vi.mocked(upsertComponentInternalTag).mock.calls.concat(
        vi.mocked(upsertComponentGroup).mock.calls,
        vi.mocked(upsertComponent).mock.calls,
      );

      // Tags should be processed first
      expect(allCalls[0][1].name).toBe('tag1');
      expect(allCalls[1][1].name).toBe('tag2');

      // Groups should be processed next
      expect(allCalls[2][1].name).toBe('Group A');
      expect(allCalls[3][1].name).toBe('Old Group');
      expect(allCalls[4][1].name).toBe('Group B');

      // Components should be processed last
      expect(allCalls[5][1].name).toBe('component-tags');

      // Verify ID/UUID mappings
      expect(results.tagsIdMap.get(1)).toBe(1001);
      expect(results.tagsIdMap.get(2)).toBe(1002);
      expect(results.groupsUuidMap.get('group-a-uuid')).toBe('new-group-a-uuid');
      expect(results.groupsUuidMap.get('group-b-uuid')).toBe('new-group-b-uuid');
      expect(results.groupsUuidMap.get('group-old-uuid')).toBe('new-group-old-uuid');
    });

    it('should update component schema with new tag IDs and group UUIDs', async () => {
      const updatedComponents: Record<number, any> = {};

      // Mock successful responses
      vi.mocked(upsertComponentInternalTag).mockImplementation(async (space, tag) => ({
        ...tag,
        id: tag.id + 1000,
      }));

      vi.mocked(upsertComponentGroup).mockImplementation(async (space, group) => ({
        ...group,
        uuid: `new-${group.uuid}`,
        id: group.id + 1000,
      }));

      vi.mocked(upsertComponent).mockImplementation(async (space, component) => {
        updatedComponents[component.id] = {
          ...component,
          id: component.id + 1000,
        };
        return updatedComponents[component.id];
      });

      await handleWhitelists(mockSpace, mockSpaceData);

      // Verify that upsertComponent was called with updated schemas
      expect(vi.mocked(upsertComponent)).toHaveBeenCalled();

      expect(updatedComponents[124].schema.field1.component_tag_whitelist).toEqual([1001, 1002]);
      expect(updatedComponents[124].schema.field2.component_group_whitelist).toEqual(['new-group-a-uuid', 'new-group-b-uuid', 'new-group-old-uuid']);
      expect(updatedComponents[124].component_group_uuid).toBe('new-group-b-uuid');
      expect(updatedComponents[124].internal_tag_ids).toEqual(['1001', '1002']);
    });

    it('should handle circular dependencies between components', async () => {
      const circularData: SpaceData = {
        ...mockSpaceData,
        components: [
          {
            name: 'component-a',
            id: 1,
            display_name: 'Component A',
            created_at: '2024-01-01',
            updated_at: '2024-01-01',
            schema: {
              field1: {
                type: 'bloks',
                component_whitelist: ['component-b'],
              },
            },
            component_group_uuid: '',
            internal_tag_ids: [],
            internal_tags_list: [],
            color: null,
          },
          {
            name: 'component-b',
            id: 2,
            display_name: 'Component B',
            created_at: '2024-01-01',
            updated_at: '2024-01-01',
            schema: {
              field1: {
                type: 'bloks',
                component_whitelist: ['component-a'],
              },
            },
            component_group_uuid: '',
            internal_tag_ids: [],
            internal_tags_list: [],
            color: null,
          },
        ],
      };

      // Mock successful responses
      vi.mocked(upsertComponent).mockImplementation(async (_space, component) => ({
        ...component,
        id: component.id + 1000,
      }));

      const results = await handleWhitelists(mockSpace, circularData);

      // Verify that circular dependency was handled by skipping
      expect(results.failed).toHaveLength(0); // No failures
      expect(results.successful).toHaveLength(2); // Only two components were processed
    });

    it('should handle missing dependencies gracefully', async () => {
      const dataWithMissingDeps: SpaceData = {
        ...mockSpaceData,
        components: [
          {
            name: 'component-with-missing-deps',
            id: 1,
            display_name: 'Component With Missing Dependencies',
            created_at: '2024-01-01',
            updated_at: '2024-01-01',
            schema: {
              field1: {
                type: 'bloks',
                component_whitelist: ['non-existent-component'],
                component_tag_whitelist: [999], // Non-existent tag
                component_group_whitelist: ['non-existent-group-uuid'],
              },
            },
            component_group_uuid: 'non-existent-group-uuid',
            internal_tag_ids: ['999'],
            internal_tags_list: [],
            color: null,
          },
        ],
      };

      const results = await handleWhitelists(mockSpace, dataWithMissingDeps);

      // Verify that missing dependencies were handled gracefully with no failures, just no updates
      expect(results.failed).toHaveLength(0);
      expect(results.successful).toHaveLength(0);
    });

    it('should skip already processed tags and groups', async () => {
      // Mock successful responses
      vi.mocked(upsertComponentInternalTag).mockImplementation(async (space, tag) => ({
        ...tag,
        id: tag.id + 1000,
      }));

      vi.mocked(upsertComponentGroup).mockImplementation(async (space, group) => ({
        ...group,
        uuid: `new-${group.uuid}`,
        id: group.id + 1000,
      }));

      // Create data with duplicate dependencies
      const dataWithDuplicates: SpaceData = {
        ...mockSpaceData,
        components: [
          ...mockSpaceData.components,
          {
            name: 'another-component',
            id: 125,
            display_name: 'Another Component',
            created_at: '2024-01-01',
            updated_at: '2024-01-01',
            schema: {
              field1: {
                type: 'bloks',
                component_tag_whitelist: [1], // Duplicate tag reference
              },
            },
            component_group_uuid: 'group-a-uuid', // Duplicate group reference
            internal_tag_ids: [],
            internal_tags_list: [],
            color: null,
          },
        ],
      };

      await handleWhitelists(mockSpace, dataWithDuplicates);

      // Verify that each tag and group was only processed once
      expect(vi.mocked(upsertComponentInternalTag)).toHaveBeenCalledTimes(2); // Only two tags
      expect(vi.mocked(upsertComponentGroup)).toHaveBeenCalledTimes(3); // Only three groups
    });
  });
});
