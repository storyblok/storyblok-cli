import type { SpaceData } from '../constants';
import { minimatch } from 'minimatch';

/**
 * Filters space data to only include a specific component (no dependencies)
 */
export function filterSpaceDataByComponent(spaceData: SpaceData, componentName: string): SpaceData {
  // Find the target component
  const targetComponent = spaceData.components.find(component => component.name === componentName);
  if (!targetComponent) {
    return {
      components: [],
      groups: [],
      internalTags: [],
      presets: [],
    };
  }

  // Find presets for this component
  const filteredPresets = spaceData.presets.filter(
    preset => preset.component_id === targetComponent.id,
  );

  return {
    components: [targetComponent],
    groups: [], // No groups - dependencies assumed to exist in target
    internalTags: [], // No tags - dependencies assumed to exist in target
    presets: filteredPresets,
  };
}

/**
 * Filters space data to only include components matching a glob pattern (no dependencies)
 */
export function filterSpaceDataByPattern(spaceData: SpaceData, pattern: string): SpaceData {
  // Filter components by pattern
  const matchingComponents = spaceData.components.filter(component =>
    minimatch(component.name, pattern),
  );

  if (matchingComponents.length === 0) {
    return {
      components: [],
      groups: [],
      internalTags: [],
      presets: [],
    };
  }

  // Find presets for matching components
  const componentIds = matchingComponents.map(component => component.id);
  const filteredPresets = spaceData.presets.filter(
    preset => componentIds.includes(preset.component_id),
  );

  return {
    components: matchingComponents,
    groups: [], // No groups - dependencies assumed to exist in target
    internalTags: [], // No tags - dependencies assumed to exist in target
    presets: filteredPresets,
  };
}
