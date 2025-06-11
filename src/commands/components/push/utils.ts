import type { SpaceData } from '../constants';
import minimatch from 'minimatch';

/**
 * Filters space data to only include a specific component and its dependencies
 */
export function filterSpaceDataByComponent(spaceData: SpaceData, componentName: string): SpaceData {
  const filteredSpaceData: SpaceData = {
    components: [],
    groups: [...spaceData.groups], // Keep all groups for dependency resolution
    internalTags: [...spaceData.internalTags], // Keep all tags for dependency resolution
    presets: [],
  };

  // Find the target component
  const targetComponent = spaceData.components.find(component => component.name === componentName);
  if (targetComponent) {
    filteredSpaceData.components.push(targetComponent);

    // Find presets for this component
    filteredSpaceData.presets = spaceData.presets.filter(
      preset => preset.component_id === targetComponent.id,
    );
  }

  return filteredSpaceData;
}

/**
 * Filters space data to only include components matching a glob pattern
 */
export function filterSpaceDataByPattern(spaceData: SpaceData, pattern: string): SpaceData {
  const filteredSpaceData: SpaceData = {
    components: [],
    groups: [...spaceData.groups], // Keep all groups for dependency resolution
    internalTags: [...spaceData.internalTags], // Keep all tags for dependency resolution
    presets: [],
  };

  // Filter components by pattern
  const matchingComponents = spaceData.components.filter(component =>
    minimatch(component.name, pattern),
  );

  filteredSpaceData.components = matchingComponents;

  // Find presets for matching components
  const componentIds = matchingComponents.map(component => component.id);
  filteredSpaceData.presets = spaceData.presets.filter(
    preset => componentIds.includes(preset.component_id),
  );

  return filteredSpaceData;
}
