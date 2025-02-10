import { getStoryblokUrl } from '../../../utils/api-routes';
import { customFetch } from '../../../utils/fetch';
import { APIError, FileSystemError, handleAPIError, handleFileSystemError } from '../../../utils';
import type { RegionCode } from '../../../constants';
import type { SpaceComponent, SpaceComponentGroup, SpaceComponentInternalTag, SpaceComponentPreset, SpaceData } from '../constants';
import type { ReadComponentsOptions } from './constants';
import { join } from 'node:path';
import { readdir, readFile } from 'node:fs/promises';
import { resolvePath } from '../../../utils/filesystem';
import { fetchComponent, fetchComponentGroups, fetchComponentInternalTags, fetchComponentPresets } from '../actions';

// Component actions
export const pushComponent = async (space: string, component: SpaceComponent, token: string, region: RegionCode): Promise<SpaceComponent | undefined> => {
  try {
    const url = getStoryblokUrl(region);

    const response = await customFetch<{
      component: SpaceComponent;
    }>(`${url}/spaces/${space}/components`, {
      method: 'POST',
      headers: {
        Authorization: token,
      },
      body: JSON.stringify(component),
    });

    return response.component;
  }
  catch (error) {
    handleAPIError('push_component', error as Error, `Failed to push component ${component.name}`);
  }
};

export const updateComponent = async (space: string, componentId: number, component: SpaceComponent, token: string, region: RegionCode): Promise<SpaceComponent | undefined> => {
  try {
    const url = getStoryblokUrl(region);
    const response = await customFetch<{
      component: SpaceComponent;
    }>(`${url}/spaces/${space}/components/${componentId}`, {
      method: 'PUT',
      headers: {
        Authorization: token,
      },
      body: JSON.stringify(component),
    });
    return response.component;
  }
  catch (error) {
    handleAPIError('update_component', error as Error, `Failed to update component ${component.name}`);
  }
};

export const upsertComponent = async (space: string, component: SpaceComponent, token: string, region: RegionCode): Promise<SpaceComponent | undefined> => {
  try {
    return await pushComponent(space, component, token, region);
  }
  catch (error) {
    if (error instanceof APIError && error.code === 422) {
      const responseData = error.response?.data as { [key: string]: string[] } | undefined;
      if (responseData?.name?.[0] === 'has already been taken') {
        // Find existing component by name
        const existingComponent = await fetchComponent(space, component.name, token, region);
        if (existingComponent) {
          // Update existing component
          return await updateComponent(space, existingComponent.id, component, token, region);
        }
      }
    }
    throw error;
  }
};

// Component group actions

export const pushComponentGroup = async (space: string, componentGroup: SpaceComponentGroup, token: string, region: RegionCode): Promise<SpaceComponentGroup | undefined> => {
  try {
    const url = getStoryblokUrl(region);
    const response = await customFetch<{
      component_group: SpaceComponentGroup;
    }>(`${url}/spaces/${space}/component_groups`, {
      method: 'POST',
      headers: {
        Authorization: token,
      },
      body: JSON.stringify(componentGroup),
    });
    return response.component_group;
  }
  catch (error) {
    handleAPIError('push_component_group', error as Error, `Failed to push component group ${componentGroup.name}`);
  }
};

export const updateComponentGroup = async (space: string, groupId: number, componentGroup: SpaceComponentGroup, token: string, region: RegionCode): Promise<SpaceComponentGroup | undefined> => {
  try {
    const url = getStoryblokUrl(region);
    const response = await customFetch<{
      component_group: SpaceComponentGroup;
    }>(`${url}/spaces/${space}/component_groups/${groupId}`, {
      method: 'PUT',
      headers: {
        Authorization: token,
      },
      body: JSON.stringify(componentGroup),
    });
    return response.component_group;
  }
  catch (error) {
    handleAPIError('update_component_group', error as Error, `Failed to update component group ${componentGroup.name}`);
  }
};

export const upsertComponentGroup = async (space: string, group: SpaceComponentGroup, token: string, region: RegionCode): Promise<SpaceComponentGroup | undefined> => {
  try {
    return await pushComponentGroup(space, group, token, region);
  }
  catch (error) {
    if (error instanceof APIError && error.code === 422) {
      const responseData = error.response?.data as { [key: string]: string[] } | undefined;
      if (responseData?.name?.[0] === 'has already been taken') {
        // Find existing group by name
        const existingGroups = await fetchComponentGroups(space, token, region);
        const existingGroup = existingGroups?.find(g => g.name === group.name);
        if (existingGroup) {
          // Update existing group
          return await updateComponentGroup(space, existingGroup.id, group, token, region);
        }
      }
    }
    throw error;
  }
};

// Component preset actions
export const pushComponentPreset = async (space: string, componentPreset: { preset: Partial<SpaceComponentPreset> }, token: string, region: RegionCode): Promise<SpaceComponentPreset | undefined> => {
  try {
    const url = getStoryblokUrl(region);
    const response = await customFetch<{
      preset: SpaceComponentPreset;
    }>(`${url}/spaces/${space}/presets`, {
      method: 'POST',
      headers: {
        Authorization: token,
      },
      body: JSON.stringify(componentPreset),
    });
    return response.preset;
  }
  catch (error) {
    handleAPIError('push_component_preset', error as Error, `Failed to push component preset ${componentPreset.preset.name}`);
  }
};

export const updateComponentPreset = async (space: string, presetId: number, componentPreset: { preset: Partial<SpaceComponentPreset> }, token: string, region: RegionCode): Promise<SpaceComponentPreset | undefined> => {
  try {
    const url = getStoryblokUrl(region);
    const response = await customFetch<{
      preset: SpaceComponentPreset;
    }>(`${url}/spaces/${space}/presets/${presetId}`, {
      method: 'PUT',
      headers: {
        Authorization: token,
      },
      body: JSON.stringify(componentPreset),
    });
    return response.preset;
  }
  catch (error) {
    handleAPIError('update_component_preset', error as Error, `Failed to update component preset ${componentPreset.preset.name}`);
  }
};

export const upsertComponentPreset = async (space: string, preset: Partial<SpaceComponentPreset>, token: string, region: RegionCode): Promise<SpaceComponentPreset | undefined> => {
  try {
    return await pushComponentPreset(space, { preset }, token, region);
  }
  catch (error) {
    if (error instanceof APIError && error.code === 422) {
      const responseData = error.response?.data as { [key: string]: string[] } | undefined;
      if (responseData?.name?.[0] === 'has already been taken') {
        // Find existing preset by name
        const existingPresets = await fetchComponentPresets(space, token, region);
        const existingPreset = existingPresets?.find(p => p.name === preset.name);
        if (existingPreset) {
          // Update existing preset
          return await updateComponentPreset(space, existingPreset.id, { preset }, token, region);
        }
      }
    }
    throw error;
  }
};

// Component internal tag actions

export const pushComponentInternalTag = async (space: string, componentInternalTag: SpaceComponentInternalTag, token: string, region: RegionCode): Promise<SpaceComponentInternalTag | undefined> => {
  try {
    const url = getStoryblokUrl(region);
    const response = await customFetch<{
      internal_tag: SpaceComponentInternalTag;
    }>(`${url}/spaces/${space}/internal_tags`, {
      method: 'POST',
      headers: {
        Authorization: token,
      },
      body: JSON.stringify(componentInternalTag),
    });
    return response.internal_tag;
  }
  catch (error) {
    handleAPIError('push_component_internal_tag', error as Error, `Failed to push component internal tag ${componentInternalTag.name}`);
  }
};

export const updateComponentInternalTag = async (space: string, tagId: number, componentInternalTag: SpaceComponentInternalTag, token: string, region: RegionCode): Promise<SpaceComponentInternalTag | undefined> => {
  try {
    const url = getStoryblokUrl(region);
    const response = await customFetch<{
      internal_tag: SpaceComponentInternalTag;
    }>(`${url}/spaces/${space}/internal_tags/${tagId}`, {
      method: 'PUT',
      headers: {
        Authorization: token,
      },
      body: JSON.stringify(componentInternalTag),
    });
    return response.internal_tag;
  }
  catch (error) {
    handleAPIError('update_component_internal_tag', error as Error, `Failed to update component internal tag ${componentInternalTag.name}`);
  }
};

export const upsertComponentInternalTag = async (space: string, tag: SpaceComponentInternalTag, token: string, region: RegionCode): Promise<SpaceComponentInternalTag | undefined> => {
  try {
    return await pushComponentInternalTag(space, tag, token, region);
  }
  catch (error) {
    if (error instanceof APIError && error.code === 422) {
      const responseData = error.response?.data as { [key: string]: string[] } | undefined;
      if (responseData?.name?.[0] === 'has already been taken') {
        // Find existing tag by name
        const existingTags = await fetchComponentInternalTags(space, token, region);
        const existingTag = existingTags?.find(t => t.name === tag.name);
        if (existingTag) {
          // Update existing tag
          return await updateComponentInternalTag(space, existingTag.id, tag, token, region);
        }
      }
    }
    throw error;
  }
};

// Filesystem actions

export const readComponentsFiles = async (
  options: ReadComponentsOptions): Promise<SpaceData> => {
  const { from, path, separateFiles = false } = options;
  const resolvedPath = resolvePath(path, `components/${from}`);

  try {
    if (separateFiles) {
      // Read from separate files
      const files = await readdir(resolvedPath);
      const components: SpaceComponent[] = [];
      const presets: SpaceComponentPreset[] = [];
      let groups: SpaceComponentGroup[] = [];
      let internalTags: SpaceComponentInternalTag[] = [];

      // Read each file
      for (const file of files) {
        const filePath = join(resolvedPath, file);
        const fileContent = (await readFile(filePath)).toString();

        if (!fileContent) {
          continue;
        }

        try {
          const parsed = JSON.parse(fileContent);

          if (file === 'groups.json') {
            groups = parsed;
          }
          else if (file === 'tags.json') {
            internalTags = parsed;
          }
          else if (file.endsWith('.preset.json')) {
            presets.push(...parsed);
          }
          else if (file.endsWith('.json')) {
            components.push(parsed);
          }
        }
        catch (error) {
          handleFileSystemError('read', error as Error);
        }
      }

      return {
        components,
        groups,
        presets,
        internalTags,
      };
    }

    // Read from consolidated files
    const componentsPath = join(resolvedPath, 'components.json');
    let components: SpaceComponent[] = [];
    let groups: SpaceComponentGroup[] = [];
    let presets: SpaceComponentPreset[] = [];
    let internalTags: SpaceComponentInternalTag[] = [];

    try {
      // First try to read components.json as it's required
      const componentsContent = (await readFile(componentsPath)).toString();
      if (componentsContent) {
        components = JSON.parse(componentsContent);
      }
      else {
        throw new FileSystemError(
          'file_not_found',
          'read',
          new Error('Components file not found'),
          `No components found in ${componentsPath}. Please make sure you have pulled the components first.`,
        );
      }

      // Then try to read optional files
      try {
        const groupsContent = (await readFile(join(resolvedPath, 'groups.json'))).toString();
        if (groupsContent) {
          groups = JSON.parse(groupsContent);
        }
      }
      catch {
        // Ignore file not found errors for optional files
      }

      try {
        const presetsContent = (await readFile(join(resolvedPath, 'presets.json'))).toString();
        if (presetsContent) {
          presets = JSON.parse(presetsContent);
        }
      }
      catch {
        // Ignore file not found errors for optional files
      }

      try {
        const tagsContent = (await readFile(join(resolvedPath, 'tags.json'))).toString();
        if (tagsContent) {
          internalTags = JSON.parse(tagsContent);
        }
      }
      catch {
        // Ignore file not found errors for optional files
      }
    }
    catch (error) {
      if (error instanceof FileSystemError) {
        throw error;
      }
      handleFileSystemError('read', error as Error);
    }

    return {
      components,
      groups,
      presets,
      internalTags,
    };
  }
  catch (error) {
    if (error instanceof FileSystemError) {
      throw error;
    }
    handleFileSystemError('read', error as Error);
    return {
      components: [],
      groups: [],
      presets: [],
      internalTags: [],
    };
  }
};
