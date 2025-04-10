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
import type { FileReaderResult } from '../../../types';

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

async function readJsonFile<T>(filePath: string): Promise<FileReaderResult<T>> {
  try {
    const content = (await readFile(filePath)).toString();
    if (!content) {
      return { data: [] };
    }
    const parsed = JSON.parse(content);
    return { data: Array.isArray(parsed) ? parsed : [parsed] };
  }
  catch (error) {
    return { data: [], error: error as Error };
  }
}

export const readComponentsFiles = async (
  options: ReadComponentsOptions): Promise<SpaceData> => {
  const { from, path, separateFiles = false, suffix } = options;
  const resolvedPath = resolvePath(path, `components/${from}`);

  // Check if directory exists first
  try {
    await readdir(resolvedPath);
  }
  catch (error) {
    const message = `No directory found for space "${from}". Please make sure you have pulled the components first by running:\n\n  storyblok components pull --space ${from}`;
    throw new FileSystemError(
      'file_not_found',
      'read',
      error as Error,
      message,
    );
  }

  if (separateFiles) {
    return await readSeparateFiles(resolvedPath, suffix);
  }

  return await readConsolidatedFiles(resolvedPath, suffix);
};

async function readSeparateFiles(resolvedPath: string, suffix?: string): Promise<SpaceData> {
  const files = await readdir(resolvedPath);
  const components: SpaceComponent[] = [];
  const presets: SpaceComponentPreset[] = [];
  let groups: SpaceComponentGroup[] = [];
  let internalTags: SpaceComponentInternalTag[] = [];

  const filteredFiles = files.filter((file) => {
    if (suffix) {
      return file.endsWith(`.${suffix}.json`);
    }
    else {
      // Regex to match files with a pattern like .<suffix>.json
      return !/\.\w+\.json$/.test(file) || file.endsWith('.presets.json'); ;
    }
  });

  for (const file of filteredFiles) {
    const filePath = join(resolvedPath, file);

    if (file === 'groups.json' || file === `groups.${suffix}.json`) {
      const result = await readJsonFile<SpaceComponentGroup>(filePath);
      if (result.error) {
        handleFileSystemError('read', result.error);
        continue;
      }
      groups = result.data;
    }
    else if (file === 'tags.json' || file === `tags.${suffix}.json`) {
      const result = await readJsonFile<SpaceComponentInternalTag>(filePath);
      if (result.error) {
        handleFileSystemError('read', result.error);
        continue;
      }
      internalTags = result.data;
    }
    else if (file.endsWith('.presets.json') || file.endsWith(`.presets.${suffix}.json`)) {
      const result = await readJsonFile<SpaceComponentPreset>(filePath);
      if (result.error) {
        handleFileSystemError('read', result.error);
        continue;
      }
      presets.push(...result.data);
    }
    else if (file.endsWith('.json') || file.endsWith(`${suffix}.json`)) {
      if (file === 'components.json' || file === `components.${suffix}.json`) {
        continue;
      }
      const result = await readJsonFile<SpaceComponent>(filePath);
      if (result.error) {
        handleFileSystemError('read', result.error);
        continue;
      }
      components.push(...result.data);
    }
  }

  return {
    components,
    groups,
    presets,
    internalTags,
  };
}

async function readConsolidatedFiles(resolvedPath: string, suffix?: string): Promise<SpaceData> {
  // Read required components file
  const componentsPath = join(resolvedPath, suffix ? `components.${suffix}.json` : 'components.json');
  const componentsResult = await readJsonFile<SpaceComponent>(componentsPath);

  if (componentsResult.error || !componentsResult.data.length) {
    throw new FileSystemError(
      'file_not_found',
      'read',
      componentsResult.error || new Error('Components file is empty'),
      `No components found in ${componentsPath}. Please make sure you have pulled the components first.`,
    );
  }

  // Read optional files
  const [groupsResult, presetsResult, tagsResult] = await Promise.all([
    readJsonFile<SpaceComponentGroup>(join(resolvedPath, suffix ? `groups.${suffix}.json` : 'groups.json')),
    readJsonFile<SpaceComponentPreset>(join(resolvedPath, suffix ? `presets.${suffix}.json` : 'presets.json')),
    readJsonFile<SpaceComponentInternalTag>(join(resolvedPath, suffix ? `tags.${suffix}.json` : 'tags.json')),
  ]);

  return {
    components: componentsResult.data,
    groups: groupsResult.data,
    presets: presetsResult.data,
    internalTags: tagsResult.data,
  };
}
