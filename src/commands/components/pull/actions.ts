import { handleAPIError, handleFileSystemError } from '../../../utils';
import type { RegionCode } from '../../../constants';
import { customFetch } from '../../../utils/fetch';
import { getStoryblokUrl } from '../../../utils/api-routes';
import type { SpaceComponent, SpaceComponentGroup, SpaceComponentInternalTag, SpaceComponentPreset, SpaceData } from '../constants';
import { join, resolve } from 'node:path';
import { resolvePath, saveToFile } from '../../../utils/filesystem';
import type { SaveComponentsOptions } from './constants';
// Components
export const fetchComponents = async (space: string, token: string, region: RegionCode): Promise<SpaceComponent[] | undefined> => {
  try {
    const url = getStoryblokUrl(region);
    const response = await customFetch<{
      components: SpaceComponent[];
    }>(`${url}/spaces/${space}/components`, {
      headers: {
        Authorization: token,
      },
    });
    return response.components;
  }
  catch (error) {
    handleAPIError('pull_components', error as Error);
  }
};

export const fetchComponent = async (space: string, componentName: string, token: string, region: RegionCode): Promise<SpaceComponent | undefined> => {
  try {
    const url = getStoryblokUrl(region);
    const response = await customFetch<{
      components: SpaceComponent[];
    }>(`${url}/spaces/${space}/components?search=${encodeURIComponent(componentName)}`, {
      headers: {
        Authorization: token,
      },
    });
    return response.components?.find(c => c.name === componentName);
  }
  catch (error) {
    handleAPIError('pull_components', error as Error, `Failed to fetch component ${componentName}`);
  }
};

// Component group actions
export const fetchComponentGroups = async (space: string, token: string, region: RegionCode): Promise<SpaceComponentGroup[] | undefined> => {
  try {
    const url = getStoryblokUrl(region);
    const response = await customFetch<{
      component_groups: SpaceComponentGroup[];
    }>(`${url}/spaces/${space}/component_groups`, {
      headers: {
        Authorization: token,
      },
    });
    return response.component_groups;
  }
  catch (error) {
    handleAPIError('pull_component_groups', error as Error);
  }
};

// Component preset actions
export const fetchComponentPresets = async (space: string, token: string, region: RegionCode): Promise<SpaceComponentPreset[] | undefined> => {
  try {
    const url = getStoryblokUrl(region);
    const response = await customFetch<{
      presets: SpaceComponentPreset[];
    }>(`${url}/spaces/${space}/presets`, {
      headers: {
        Authorization: token,
      },
    });
    return response.presets;
  }
  catch (error) {
    handleAPIError('pull_component_presets', error as Error);
  }
};

// Component internal tags
export const fetchComponentInternalTags = async (space: string, token: string, region: RegionCode): Promise<SpaceComponentInternalTag[] | undefined> => {
  try {
    const url = getStoryblokUrl(region);
    const response = await customFetch<{
      internal_tags: SpaceComponentInternalTag[];
    }>(`${url}/spaces/${space}/internal_tags`, {
      headers: {
        Authorization: token,
      },
    });
    return response.internal_tags.filter(tag => tag.object_type === 'component');
  }
  catch (error) {
    handleAPIError('pull_component_internal_tags', error as Error);
  }
};

// Filesystem actions

export const saveComponentsToFiles = async (
  space: string,
  spaceData: SpaceData,
  options: SaveComponentsOptions,
) => {
  const { components = [], groups = [], presets = [], internalTags = [] } = spaceData;
  const { filename = 'components', suffix, path, separateFiles } = options;
  // Ensure we always include the components/space folder structure regardless of custom path
  const resolvedPath = path
    ? resolve(process.cwd(), path, 'components', space)
    : resolvePath(path, `components/${space}`);

  try {
    if (separateFiles) {
      // Save in separate files without nested structure
      for (const component of components) {
        const componentFilePath = join(resolvedPath, suffix ? `${component.name}.${suffix}.json` : `${component.name}.json`);
        await saveToFile(componentFilePath, JSON.stringify(component, null, 2));

        // Find and save associated presets
        const componentPresets = presets.filter(preset => preset.component_id === component.id);
        if (componentPresets.length > 0) {
          const presetsFilePath = join(resolvedPath, suffix ? `${component.name}.presets.${suffix}.json` : `${component.name}.presets.json`);
          await saveToFile(presetsFilePath, JSON.stringify(componentPresets, null, 2));
        }
        // Always save groups in a consolidated file
        const groupsFilePath = join(resolvedPath, suffix ? `groups.${suffix}.json` : `groups.json`);
        await saveToFile(groupsFilePath, JSON.stringify(groups, null, 2));

        // Always save internal tags in a consolidated file
        const internalTagsFilePath = join(resolvedPath, suffix ? `tags.${suffix}.json` : `tags.json`);
        await saveToFile(internalTagsFilePath, JSON.stringify(internalTags, null, 2));
      }
      return;
    }

    // Default to saving consolidated files
    const componentsFilePath = join(resolvedPath, suffix ? `${filename}.${suffix}.json` : `${filename}.json`);
    await saveToFile(componentsFilePath, JSON.stringify(components, null, 2));

    if (groups.length > 0) {
      const groupsFilePath = join(resolvedPath, suffix ? `groups.${suffix}.json` : `groups.json`);
      await saveToFile(groupsFilePath, JSON.stringify(groups, null, 2));
    }

    if (presets.length > 0) {
      const presetsFilePath = join(resolvedPath, suffix ? `presets.${suffix}.json` : `presets.json`);
      await saveToFile(presetsFilePath, JSON.stringify(presets, null, 2));
    }

    if (internalTags.length > 0) {
      const internalTagsFilePath = join(resolvedPath, suffix ? `tags.${suffix}.json` : `tags.json`);
      await saveToFile(internalTagsFilePath, JSON.stringify(internalTags, null, 2));
    }
  }
  catch (error) {
    handleFileSystemError('write', error as Error);
  }
};
