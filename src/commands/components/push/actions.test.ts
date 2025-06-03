import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import { vol } from 'memfs';
import { afterAll, afterEach, beforeAll, describe, expect, it, vi } from 'vitest';
import { pushComponent, pushComponentGroup, pushComponentInternalTag, pushComponentPreset, readComponentsFiles, updateComponent, updateComponentGroup, updateComponentInternalTag, updateComponentPreset, upsertComponent, upsertComponentGroup, upsertComponentInternalTag, upsertComponentPreset } from './actions';
import type { SpaceComponent, SpaceComponentGroup, SpaceComponentInternalTag, SpaceComponentPreset } from '../constants';
import chalk from 'chalk';

const mockComponent: SpaceComponent = {
  name: 'component-name',
  display_name: 'Component Name',
  created_at: '2021-08-09T12:00:00Z',
  updated_at: '2021-08-09T12:00:00Z',
  id: 12345,
  schema: { type: 'object' },
  color: null,
  internal_tags_list: [],
  internal_tag_ids: ['1'],
};

const mockComponentExisting: SpaceComponent = {
  name: 'component-name-2',
  display_name: 'Component Name @',
  created_at: '2021-08-09T12:00:00Z',
  updated_at: '2021-08-09T12:00:00Z',
  id: 12346,
  schema: { type: 'object' },
  color: null,
  internal_tags_list: [],
  internal_tag_ids: ['1'],
};

const mockComponentGroup: SpaceComponentGroup = {
  name: 'group-name',
  uuid: 'group-uuid',
  id: 1,
  parent_id: 0,
  parent_uuid: 'parent-uuid',
};

const mockComponentGroupExisting: SpaceComponentGroup = {
  name: 'group-name-2',
  uuid: 'group-uuid-2',
  id: 2,
  parent_id: 0,
  parent_uuid: 'parent-uuid',
};

const mockComponentPreset: SpaceComponentPreset = {
  id: 1,
  name: 'preset-name',
  component_id: 1,
  preset: { field: 'value' },
  space_id: 12345,
  created_at: '2021-08-09T12:00:00Z',
  updated_at: '2021-08-09T12:00:00Z',
  image: '',
  color: '',
  icon: '',
  description: '',
};

const mockComponentPresetExisting: SpaceComponentPreset = {
  id: 2,
  name: 'preset-name-2',
  component_id: 1,
  preset: { field: 'value' },
  space_id: 12345,
  created_at: '2021-08-09T12:00:00Z',
  updated_at: '2021-08-09T12:00:00Z',
  image: '',
  color: '',
  icon: '',
  description: '',
};

const mockComponentPresetExistingDifferentComponent: SpaceComponentPreset = {
  id: 3,
  // component present names aren't globally unique, they're only unique for each component
  name: 'preset-name-2',
  component_id: 2,
  preset: { field: 'value' },
  space_id: 12345,
  created_at: '2021-08-09T12:00:00Z',
  updated_at: '2021-08-09T12:00:00Z',
  image: '',
  color: '',
  icon: '',
  description: '',
};

const mockInternalTag: SpaceComponentInternalTag = {
  id: 1,
  name: 'tag-name',
  object_type: 'component',
};

const mockInternalTagExisting: SpaceComponentInternalTag = {
  id: 2,
  name: 'tag-name-2',
  object_type: 'component',
};

const handlers = [
  // Component handlers
  http.post('https://api.storyblok.com/v1/spaces/12345/components', async ({ request }) => {
    const token = request.headers.get('Authorization');
    if (token === 'valid-token') {
      const body: any = await request.json();
      if (body.id === mockComponentExisting.id) {
        return HttpResponse.json({ name: ['has already been taken'] }, { status: 422 });
      }
      else {
        return HttpResponse.json({ component: mockComponent });
      }
    }
    return new HttpResponse('Unauthorized', { status: 401 });
  }),
  http.put('https://api.storyblok.com/v1/spaces/12345/components/12345', async ({ request }) => {
    const token = request.headers.get('Authorization');
    if (token === 'valid-token') {
      return HttpResponse.json({ component: mockComponent });
    }
    return new HttpResponse('Unauthorized', { status: 401 });
  }),
  http.get('https://api.storyblok.com/v1/spaces/12345/components', async ({ request }) => {
    const token = request.headers.get('Authorization');
    if (token === 'valid-token') {
      return HttpResponse.json({ components: [mockComponentExisting] });
    }
    return new HttpResponse('Unauthorized', { status: 401 });
  }),
  http.put('https://api.storyblok.com/v1/spaces/12345/components/12346', async ({ request }) => {
    const token = request.headers.get('Authorization');
    if (token === 'valid-token') {
      return HttpResponse.json({ component: mockComponentExisting });
    }
    return new HttpResponse('Unauthorized', { status: 401 });
  }),

  // Component group handlers
  http.post('https://api.storyblok.com/v1/spaces/12345/component_groups', async ({ request }) => {
    const token = request.headers.get('Authorization');
    if (token === 'valid-token') {
      const body: any = await request.json();
      if (body.id === mockComponentPresetExisting.id) {
        return HttpResponse.json({ name: ['has already been taken'] }, { status: 422 });
      }
      else {
        return HttpResponse.json({ component_group: mockComponentGroup });
      }
    }
    return new HttpResponse('Unauthorized', { status: 401 });
  }),
  http.put('https://api.storyblok.com/v1/spaces/12345/component_groups/1', async ({ request }) => {
    const token = request.headers.get('Authorization');
    if (token === 'valid-token') {
      return HttpResponse.json({ component_group: mockComponentGroup });
    }
    return new HttpResponse('Unauthorized', { status: 401 });
  }),
  http.get('https://api.storyblok.com/v1/spaces/12345/component_groups', async ({ request }) => {
    const token = request.headers.get('Authorization');
    if (token === 'valid-token') {
      return HttpResponse.json({ component_groups: [mockComponentGroupExisting] });
    }
    return new HttpResponse('Unauthorized', { status: 401 });
  }),
  http.put('https://api.storyblok.com/v1/spaces/12345/component_groups/2', async ({ request }) => {
    const token = request.headers.get('Authorization');
    if (token === 'valid-token') {
      return HttpResponse.json({ component_group: mockComponentGroupExisting });
    }
    return new HttpResponse('Unauthorized', { status: 401 });
  }),

  // Component preset handlers
  http.post('https://api.storyblok.com/v1/spaces/12345/presets', async ({ request }) => {
    const token = request.headers.get('Authorization');
    if (token === 'valid-token') {
      const body: any = await request.json();
      if (body.preset.id === mockComponentPresetExisting.id || body.preset.id === mockComponentPresetExistingDifferentComponent.id) {
        return HttpResponse.json({ name: ['has already been taken'] }, { status: 422 });
      }
      else {
        return HttpResponse.json({ preset: mockComponentPreset });
      }
    }
    return new HttpResponse('Unauthorized', { status: 401 });
  }),
  http.put('https://api.storyblok.com/v1/spaces/12345/presets/1', async ({ request }) => {
    const token = request.headers.get('Authorization');
    if (token === 'valid-token') {
      return HttpResponse.json({ preset: mockComponentPreset });
    }
    return new HttpResponse('Unauthorized', { status: 401 });
  }),
  http.get('https://api.storyblok.com/v1/spaces/12345/presets', async ({ request }) => {
    const token = request.headers.get('Authorization');
    if (token === 'valid-token') {
      return HttpResponse.json({ presets: [mockComponentPresetExisting, mockComponentPresetExistingDifferentComponent] });
    }
    return new HttpResponse('Unauthorized', { status: 401 });
  }),
  http.put('https://api.storyblok.com/v1/spaces/12345/presets/2', async ({ request }) => {
    const token = request.headers.get('Authorization');
    if (token === 'valid-token') {
      return HttpResponse.json({ preset: mockComponentPresetExisting });
    }
    return new HttpResponse('Unauthorized', { status: 401 });
  }),
  http.put('https://api.storyblok.com/v1/spaces/12345/presets/3', async ({ request }) => {
    const token = request.headers.get('Authorization');
    if (token === 'valid-token') {
      return HttpResponse.json({ preset: mockComponentPresetExistingDifferentComponent });
    }
    return new HttpResponse('Unauthorized', { status: 401 });
  }),

  // Internal tag handlers
  http.post('https://api.storyblok.com/v1/spaces/12345/internal_tags', async ({ request }) => {
    const token = request.headers.get('Authorization');
    if (token === 'valid-token') {
      const body: any = await request.json();
      if (body.id === mockInternalTagExisting.id) {
        return HttpResponse.json({ name: ['has already been taken'] }, { status: 422 });
      }
      else {
        return HttpResponse.json({ internal_tag: mockInternalTag });
      }
    }
    return new HttpResponse('Unauthorized', { status: 401 });
  }),
  http.put('https://api.storyblok.com/v1/spaces/12345/internal_tags/1', async ({ request }) => {
    const token = request.headers.get('Authorization');
    if (token === 'valid-token') {
      return HttpResponse.json({ internal_tag: mockInternalTag });
    }
    return new HttpResponse('Unauthorized', { status: 401 });
  }),
  http.get('https://api.storyblok.com/v1/spaces/12345/internal_tags', async ({ request }) => {
    const token = request.headers.get('Authorization');
    if (token === 'valid-token') {
      return HttpResponse.json({ internal_tags: [mockInternalTagExisting] });
    }
    return new HttpResponse('Unauthorized', { status: 401 });
  }),
  http.put('https://api.storyblok.com/v1/spaces/12345/internal_tags/2', async ({ request }) => {
    const token = request.headers.get('Authorization');
    if (token === 'valid-token') {
      return HttpResponse.json({ internal_tag: mockInternalTagExisting });
    }
    return new HttpResponse('Unauthorized', { status: 401 });
  }),
];

const server = setupServer(...handlers);

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

vi.mock('node:fs');
vi.mock('node:fs/promises');

describe('push components actions', () => {
  describe('component', () => {
    it('should push component successfully with a valid token', async () => {
      const result = await pushComponent('12345', mockComponent, 'valid-token', 'eu');
      expect(result).toEqual(mockComponent);
    });

    it('should update component successfully with a valid token', async () => {
      const result = await updateComponent('12345', 12345, mockComponent, 'valid-token', 'eu');
      expect(result).toEqual(mockComponent);
    });

    it('should upsert component successfully with a valid token', async () => {
      const result = await upsertComponent('12345', mockComponent, 'valid-token', 'eu');
      expect(result).toEqual(mockComponent);
    });

    it('should upsert existing component successfully with a valid token', async () => {
      const result = await upsertComponent('12345', mockComponentExisting, 'valid-token', 'eu');
      expect(result).toEqual(mockComponentExisting);
    });

    it('should throw an error for invalid token', async () => {
      await expect(pushComponent('12345', mockComponent, 'invalid-token', 'eu')).rejects.toThrow(
        expect.objectContaining({
          name: 'API Error',
          message: 'Failed to push component component-name',
          cause: 'The user is not authorized to access the API',
          errorId: 'unauthorized',
          code: 401,
          messageStack: ['Failed to push component component-name'],
          error: expect.objectContaining({
            message: 'Non-JSON response',
            response: {
              data: null,
              status: 401,
              statusText: 'Unauthorized',
            },
            name: 'FetchError',
          }),
          response: {
            data: null,
            status: 401,
            statusText: 'Unauthorized',
          },
        }),
      );
    });
  });

  describe('component group', () => {
    it('should push component group successfully with a valid token', async () => {
      const result = await pushComponentGroup('12345', mockComponentGroup, 'valid-token', 'eu');
      expect(result).toEqual(mockComponentGroup);
    });

    it('should update component group successfully with a valid token', async () => {
      const result = await updateComponentGroup('12345', 1, mockComponentGroup, 'valid-token', 'eu');
      expect(result).toEqual(mockComponentGroup);
    });

    it('should upsert component group successfully with a valid token', async () => {
      const result = await upsertComponentGroup('12345', mockComponentGroup, 'valid-token', 'eu');
      expect(result).toEqual(mockComponentGroup);
    });

    it('should upsert existing component group successfully with a valid token', async () => {
      const result = await upsertComponentGroup('12345', mockComponentGroupExisting, 'valid-token', 'eu');
      expect(result).toEqual(mockComponentGroupExisting);
    });
  });

  describe('component preset', () => {
    it('should push component preset successfully with a valid token', async () => {
      const result = await pushComponentPreset('12345', { preset: mockComponentPreset }, 'valid-token', 'eu');
      expect(result).toEqual(mockComponentPreset);
    });

    it('should update component preset successfully with a valid token', async () => {
      const result = await updateComponentPreset('12345', 1, { preset: mockComponentPreset }, 'valid-token', 'eu');
      expect(result).toEqual(mockComponentPreset);
    });

    it('should upsert component preset successfully with a valid token', async () => {
      const result = await upsertComponentPreset('12345', mockComponentPreset, 'valid-token', 'eu');
      expect(result).toEqual(mockComponentPreset);
    });

    it('should upsert existing component preset successfully with a valid token', async () => {
      const result = await upsertComponentPreset('12345', mockComponentPresetExisting, 'valid-token', 'eu');
      expect(result).toEqual(mockComponentPresetExisting);
    });

    it('should upsert existing component preset with a duplicated name successfully with a valid token', async () => {
      const result = await upsertComponentPreset('12345', mockComponentPresetExistingDifferentComponent, 'valid-token', 'eu');
      expect(result).toEqual(mockComponentPresetExistingDifferentComponent);
    });
  });

  describe('component internal tag', () => {
    it('should push component internal tag successfully with a valid token', async () => {
      const result = await pushComponentInternalTag('12345', mockInternalTag, 'valid-token', 'eu');
      expect(result).toEqual(mockInternalTag);
    });

    it('should update component internal tag successfully with a valid token', async () => {
      const result = await updateComponentInternalTag('12345', 1, mockInternalTag, 'valid-token', 'eu');
      expect(result).toEqual(mockInternalTag);
    });

    it('should upsert component internal tag successfully with a valid token', async () => {
      const result = await upsertComponentInternalTag('12345', mockInternalTag, 'valid-token', 'eu');
      expect(result).toEqual(mockInternalTag);
    });

    it('should upsert existing component internal tag successfully with a valid token', async () => {
      const result = await upsertComponentInternalTag('12345', mockInternalTagExisting, 'valid-token', 'eu');
      expect(result).toEqual(mockInternalTagExisting);
    });
  });

  describe('readComponentsFiles', () => {
    it('should read components from consolidated files successfully', async () => {
      vol.fromJSON({
        '/path/to/components/12345/consolidated/components.json': JSON.stringify([mockComponent]),
        '/path/to/components/12345/consolidated/groups.json': JSON.stringify([mockComponentGroup]),
        '/path/to/components/12345/consolidated/presets.json': JSON.stringify([mockComponentPreset]),
        '/path/to/components/12345/consolidated/tags.json': JSON.stringify([mockInternalTag]),
      });

      const result = await readComponentsFiles({
        path: '/path/to/',
        from: '12345',
        separateFiles: false,
        verbose: false,
      });

      expect(result).toEqual({
        components: [mockComponent],
        groups: [mockComponentGroup],
        presets: [mockComponentPreset],
        internalTags: [mockInternalTag],
      });
    });

    it('should read components from consolidated files with suffix successfully', async () => {
      vol.fromJSON({
        '/path/to/components/12345/consolidated/components.dev.json': JSON.stringify([mockComponent]),
        '/path/to/components/12345/consolidated/groups.dev.json': JSON.stringify([mockComponentGroup]),
        '/path/to/components/12345/consolidated/presets.dev.json': JSON.stringify([mockComponentPreset]),
        '/path/to/components/12345/consolidated/tags.dev.json': JSON.stringify([mockInternalTag]),
      });

      const result = await readComponentsFiles({
        path: '/path/to/',
        from: '12345',
        separateFiles: false,
        suffix: 'dev',
        verbose: false,
      });

      expect(result).toEqual({
        components: [mockComponent],
        groups: [mockComponentGroup],
        presets: [mockComponentPreset],
        internalTags: [mockInternalTag],
      });
    });

    it('should read components from separate files successfully', async () => {
      vol.fromJSON({
        '/path/to/components/23746/component-name.json': JSON.stringify(mockComponent),
        '/path/to/components/23746/component-name.presets.json': JSON.stringify([mockComponentPreset]),
        '/path/to/components/23746/consolidated/groups.json': JSON.stringify([mockComponentGroup]),
        '/path/to/components/23746/consolidated/tags.json': JSON.stringify([mockInternalTag]),
      });

      const result = await readComponentsFiles({
        path: '/path/to/',
        from: '23746',
        separateFiles: true,
        verbose: false,
      });

      expect(result).toEqual({
        components: [mockComponent],
        groups: [mockComponentGroup],
        presets: [mockComponentPreset],
        internalTags: [mockInternalTag],
      });
    });

    it('should read components from separate files with suffix successfully', async () => {
      vol.fromJSON({
        '/path/to/components/23747/component-name.dev.json': JSON.stringify(mockComponent),
        '/path/to/components/23747/component-a.presets.dev.json': JSON.stringify([mockComponentPreset]),
        '/path/to/components/23747/consolidated/groups.dev.json': JSON.stringify([mockComponentGroup]),
        '/path/to/components/23747/consolidated/tags.dev.json': JSON.stringify([mockInternalTag]),
      });

      const result = await readComponentsFiles({
        path: '/path/to/',
        from: '23747',
        separateFiles: true,
        suffix: 'dev',
        verbose: false,
      });

      expect(result).toEqual({
        components: [mockComponent],
        groups: [mockComponentGroup],
        presets: [mockComponentPreset],
        internalTags: [mockInternalTag],
      });
    });

    it('should ignore component consolidated files if separate files are used', async () => {
      vol.fromJSON({
        '/path/to/components/23748/consolidated/components.json': JSON.stringify([mockComponent]),
        '/path/to/components/23748/component-name.json': JSON.stringify(mockComponent),
        '/path/to/components/23748/component-name.presets.json': JSON.stringify([mockComponentPreset]),
        '/path/to/components/23748/consolidated/groups.json': JSON.stringify([mockComponentGroup]),
        '/path/to/components/23748/consolidated/tags.json': JSON.stringify([mockInternalTag]),
      });

      const result = await readComponentsFiles({
        path: '/path/to/',
        from: '23748',
        separateFiles: true,
        verbose: false,
      });

      expect(result).toEqual({
        components: [mockComponent],
        groups: [mockComponentGroup],
        presets: [mockComponentPreset],
        internalTags: [mockInternalTag],
      });
    });

    it('should throw an error if components directory does not exist', async () => {
      await expect(readComponentsFiles({
        path: '/temp/path/to/components',
        from: 'non-existent',
        space: 'existing-space',
        separateFiles: false,
        verbose: false,
      })).rejects.toThrow(
        expect.objectContaining({
          name: 'File System Error',
          errorId: 'file_not_found',
          cause: 'The file requested was not found',
          code: 'ENOENT',
          error: expect.objectContaining({
            code: 'ENOENT',
            message: expect.stringContaining('ENOENT: no such file or directory'),
          }),
          message: expect.stringContaining(
            `No local components found for space ${chalk.bold('non-existent')}. To push components, you need to pull them first:

1. Pull the components from your source space:
   ${chalk.cyan('storyblok components pull --space non-existent')}

2. Then try pushing again:
   ${chalk.cyan('storyblok components push --space existing-space --from non-existent')}`,
          ),
        }),
      );
    });
  });
});
