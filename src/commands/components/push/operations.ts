import { Spinner } from '@topcli/spinner';
import chalk from 'chalk';
import { colorPalette } from '../../../constants';
import { createRegexFromGlob, isVitest } from '../../../utils';
import type { RegionCode } from '../../../constants';
import type {
  SpaceComponent,
  SpaceComponentGroup,
  SpaceComponentInternalTag,
  SpaceComponentPreset,
  SpaceData,
} from '../constants';
import { upsertComponent, upsertComponentGroup, upsertComponentInternalTag, upsertComponentPreset } from './actions';
import { delay } from '../../../utils/fetch';

function findRelatedResources(
  components: SpaceComponent[],
  spaceData: SpaceData,
  visitedComponents = new Set<string>(), // Track visited components to detect cycles
): {
    groups: SpaceComponentGroup[];
    presets: SpaceComponentPreset[];
    internalTags: SpaceComponentInternalTag[];
    whitelistedComponents: SpaceComponent[];
  } {
  // Get all component IDs and UUIDs for filtering related resources
  const componentIds = new Set(components.map(c => c.id));
  const whitelistedComponentNames = new Set<string>();

  // Get all group UUIDs from components and their schemas
  const componentGroupUuids = new Set<string>();

  components.forEach((component) => {
    // Add direct component group
    if (component.component_group_uuid && component.component_group_uuid.length > 0) {
      componentGroupUuids.add(component.component_group_uuid);
    }

    // Collect groups and whitelisted components from component's schema
    if (component.schema) {
      function traverseSchema(schema: Record<string, any>) {
        if (typeof schema === 'object' && schema !== null) {
          if (schema.type === 'bloks') {
            // Collect group whitelist
            if (schema.restrict_type === 'groups' && Array.isArray(schema.component_group_whitelist)) {
              schema.component_group_whitelist.forEach((uuid: string) => {
                if (uuid && uuid.length > 0) {
                  componentGroupUuids.add(uuid);
                }
              });
            }

            // Collect component whitelist
            if (Array.isArray(schema.component_whitelist)) {
              schema.component_whitelist.forEach((name: string) => {
                if (name && typeof name === 'string') {
                  whitelistedComponentNames.add(name);
                }
              });
            }
          }

          // Recursively traverse nested fields
          Object.values(schema).forEach((value) => {
            if (typeof value === 'object' && value !== null) {
              traverseSchema(value);
            }
          });
        }
      }

      traverseSchema(component.schema);
    }
  });

  const tagIds = new Set<number>();

  // Collect all tag IDs from components
  components.forEach((component) => {
    // Collect tags from component's internal_tag_ids
    component.internal_tag_ids?.forEach(id => tagIds.add(Number(id)));

    // Collect tags from component's schema whitelists
    if (component.schema) {
      function traverseSchema(schema: Record<string, any>) {
        if (typeof schema === 'object' && schema !== null) {
          if (schema.type === 'bloks' && Array.isArray(schema.component_tag_whitelist)) {
            schema.component_tag_whitelist.forEach((id: string | number) => {
              if (id) {
                tagIds.add(Number(id));
              }
            });
          }

          // Recursively traverse nested fields
          Object.values(schema).forEach((value) => {
            if (typeof value === 'object' && value !== null) {
              traverseSchema(value);
            }
          });
        }
      }

      traverseSchema(component.schema);
    }
  });

  // Get related presets for all components
  const relatedPresets = spaceData.presets.filter(p => componentIds.has(p.component_id));

  // Get related tags
  const relatedTags = spaceData.internalTags.filter(tag => tagIds.has(tag.id));

  // Get related groups (including parent hierarchy) for all components
  const relatedGroups = new Set<SpaceComponentGroup>();

  // Create a map of all groups for efficient lookup
  const groupsMap = new Map(spaceData.groups.map(g => [g.uuid, g]));

  // For each component's group UUID, traverse up the hierarchy
  componentGroupUuids.forEach((groupUuid) => {
    let currentGroup = groupsMap.get(groupUuid);

    while (currentGroup) {
      relatedGroups.add(currentGroup);

      // If the group has a parent, get it from the map
      if (currentGroup.parent_uuid && currentGroup.parent_uuid.length > 0 && currentGroup.parent_uuid !== currentGroup.uuid) {
        currentGroup = groupsMap.get(currentGroup.parent_uuid);
      }
      else {
        currentGroup = undefined;
      }
    }
  });

  // Get whitelisted components
  const whitelistedComponents = spaceData.components.filter(
    component => whitelistedComponentNames.has(component.name),
  );

  // Get related resources for whitelisted components recursively
  let additionalResources = {
    groups: [] as SpaceComponentGroup[],
    presets: [] as SpaceComponentPreset[],
    internalTags: [] as SpaceComponentInternalTag[],
    whitelistedComponents: [] as SpaceComponent[],
  };

  if (whitelistedComponents.length > 0) {
    // Filter out components that would create circular dependencies
    const newComponents = whitelistedComponents.filter(component => !visitedComponents.has(component.name));

    if (newComponents.length > 0) {
      // Add current components to visited set
      components.forEach(component => visitedComponents.add(component.name));

      // Only process components we haven't seen before
      additionalResources = findRelatedResources(newComponents, spaceData, visitedComponents);
    }
  }

  const result = {
    groups: Array.from(new Set([...Array.from(relatedGroups), ...additionalResources.groups])),
    presets: [...relatedPresets, ...additionalResources.presets],
    internalTags: [...relatedTags, ...additionalResources.internalTags],
    whitelistedComponents: [...whitelistedComponents, ...additionalResources.whitelistedComponents],
  };

  return result;
}

export function filterSpaceDataByPattern(spaceData: SpaceData, pattern: string): SpaceData {
  const regex = createRegexFromGlob(pattern);
  const matchedComponents = spaceData.components.filter(c => regex.test(c.name));

  if (!matchedComponents.length) {
    return {
      components: [],
      groups: [],
      presets: [],
      internalTags: [],
    };
  }

  const relatedResources = findRelatedResources(matchedComponents, spaceData);

  return {
    components: [...matchedComponents, ...relatedResources.whitelistedComponents],
    groups: relatedResources.groups,
    presets: relatedResources.presets,
    internalTags: relatedResources.internalTags,
  };
}

export function filterSpaceDataByComponent(spaceData: SpaceData, componentName: string): SpaceData {
  // Find the specific component
  const component = spaceData.components.find(c => c.name === componentName);
  if (!component) {
    return {
      components: [],
      groups: [],
      presets: [],
      internalTags: [],
    };
  }

  const relatedResources = findRelatedResources([component], spaceData);

  return {
    components: [component, ...relatedResources.whitelistedComponents],
    groups: relatedResources.groups,
    presets: relatedResources.presets,
    internalTags: relatedResources.internalTags,
  };
}

export async function handleTags(
  space: string,
  password: string,
  region: RegionCode,
  spaceData: SpaceComponentInternalTag[],
  skipIds?: Set<number>,
) {
  const results = {
    successful: [] as string[],
    failed: [] as Array<{ name: string; error: unknown }>,
    idMap: new Map<number, number>(),
  };

  // Filter out tags that should be skipped
  const tagsToProcess = skipIds
    ? spaceData.filter(tag => !skipIds.has(tag.id))
    : spaceData;

  await Promise.all(tagsToProcess.map(async (tag) => {
    const consolidatedSpinner = new Spinner({
      verbose: !isVitest,
    });
    consolidatedSpinner.start('Upserting tags...');
    try {
      const updatedTag = await upsertComponentInternalTag(space, tag, password, region);
      if (updatedTag) {
        results.idMap.set(tag.id, updatedTag.id);
        results.successful.push(tag.name);
        consolidatedSpinner.succeed(`Tag-> ${chalk.hex(colorPalette.COMPONENTS)(tag.name)} - Completed in ${consolidatedSpinner.elapsedTime.toFixed(2)}ms`);
      }
    }
    catch (error) {
      consolidatedSpinner.failed(`Tag-> ${chalk.hex(colorPalette.COMPONENTS)(tag.name)} - Failed`);
      results.failed.push({ name: tag.name, error });
    }
  }));
  return results;
}

export async function handleComponentGroups(
  space: string,
  password: string,
  region: RegionCode,
  spaceData: SpaceComponentGroup[],
  skipUuids?: Set<string>,
) {
  const results = {
    successful: [] as string[],
    failed: [] as Array<{ name: string; error: unknown }>,
    uuidMap: new Map<string, string>(), // Maps old UUIDs to new UUIDs
    idMap: new Map<number, number>(), // Maps old IDs to new IDs
  };

  // Filter out groups that should be skipped
  const groupsToProcess = skipUuids
    ? spaceData.filter(group => !skipUuids.has(group.uuid))
    : spaceData;

  // First, process groups without parents
  // This conditional handles a strange scenario where group (folders) ids are equal to their parents
  const rootGroups = groupsToProcess.filter(group => (!group.parent_uuid || group.parent_uuid === group.uuid) && !group.parent_id);
  for (const group of rootGroups) {
    const spinner = new Spinner({
      verbose: !isVitest,
    });
    spinner.start(`Upserting root group ${group.name}...`);
    try {
      const updatedGroup = await upsertComponentGroup(space, group, password, region);
      if (updatedGroup) {
        results.uuidMap.set(group.uuid, updatedGroup.uuid);
        results.idMap.set(group.id, updatedGroup.id);
        results.successful.push(group.name);
        spinner.succeed(`Group-> ${chalk.hex(colorPalette.COMPONENTS)(group.name)} - Completed in ${spinner.elapsedTime.toFixed(2)}ms`);
      }
    }
    catch (error) {
      spinner.failed(`Group-> ${chalk.hex(colorPalette.COMPONENTS)(group.name)} - Failed`);
      results.failed.push({ name: group.name, error });
    }
  }

  // Then process groups with parents recursively
  const processedGroups = new Set<string>();
  rootGroups.forEach(group => processedGroups.add(group.uuid));

  async function processChildGroups() {
    let processedAny = false;
    const remainingGroups = spaceData.filter(group => !processedGroups.has(group.uuid));

    for (const group of remainingGroups) {
      if (!group.parent_uuid || !group.parent_id) {
        continue;
      }

      // Check if parent has been processed
      const newParentUuid = results.uuidMap.get(group.parent_uuid);
      const newParentId = results.idMap.get(group.parent_id);
      if (!newParentUuid || !newParentId) {
        continue;
      }

      const spinner = new Spinner({
        verbose: !isVitest,
      });
      spinner.start(`Upserting child group ${group.name}...`);

      try {
        // Update the group with the new parent UUID and ID
        const groupToUpdate = {
          ...group,
          parent_uuid: newParentUuid,
          parent_id: newParentId,
        };

        const updatedGroup = await upsertComponentGroup(space, groupToUpdate, password, region);
        if (updatedGroup) {
          results.uuidMap.set(group.uuid, updatedGroup.uuid);
          results.idMap.set(group.id, updatedGroup.id);
          results.successful.push(group.name);
          processedGroups.add(group.uuid);
          processedAny = true;
          spinner.succeed(`Group-> ${chalk.hex(colorPalette.COMPONENTS)(group.name)} - Completed in ${spinner.elapsedTime.toFixed(2)}ms`);
        }
      }
      catch (error) {
        spinner.failed(`Group-> ${chalk.hex(colorPalette.COMPONENTS)(group.name)} - Failed`);
        results.failed.push({ name: group.name, error });
        processedGroups.add(group.uuid); // Mark as processed even if failed to avoid infinite loop
      }
    }

    // If we processed any groups and there are still unprocessed groups, continue recursively
    if (processedAny && processedGroups.size < spaceData.length) {
      await processChildGroups();
    }
  }

  await processChildGroups();
  return results;
}

/**
 * Collects all whitelist dependencies from a component's schema
 */
function collectWhitelistDependencies(
  schema: Record<string, any>,
): {
    groupUuids: Set<string>;
    tagIds: Set<number>;
    componentNames: Set<string>;
  } {
  const dependencies = {
    groupUuids: new Set<string>(),
    tagIds: new Set<number>(),
    componentNames: new Set<string>(),
  };

  function traverse(field: Record<string, any>) {
    if (typeof field === 'object' && field !== null) {
      if (field.type === 'bloks') {
        // Collect group whitelist UUIDs
        if (field.restrict_type === 'groups' && Array.isArray(field.component_group_whitelist)) {
          field.component_group_whitelist.forEach((uuid: string) => {
            if (uuid && uuid.length > 0) {
              dependencies.groupUuids.add(uuid);
            }
          });
        }

        // Collect tag whitelist IDs
        if (Array.isArray(field.component_tag_whitelist)) {
          field.component_tag_whitelist.forEach((id: string | number) => {
            if (id) {
              dependencies.tagIds.add(Number(id));
            }
          });
        }

        // Collect component whitelist names
        if (Array.isArray(field.component_whitelist)) {
          field.component_whitelist.forEach((name: string) => {
            if (name && typeof name === 'string') {
              dependencies.componentNames.add(name);
            }
          });
        }
      }

      // Recursively traverse nested fields
      Object.values(field).forEach((value) => {
        if (typeof value === 'object' && value !== null) {
          traverse(value);
        }
      });
    }
  }

  traverse(schema);
  return dependencies;
}

/**
 * Updates the whitelist references in a component's schema with new IDs/UUIDs
 */
function updateSchemaWhitelists(
  schema: Record<string, any>,
  groupsUuidMap: Map<string, string>,
  tagsIdMap: Map<number, number>,
  componentNameMap?: Map<string, string>,
): void {
  // Recursively process all fields in the schema
  Object.values(schema).forEach((field) => {
    if (typeof field === 'object' && field !== null) {
      if (field.type === 'bloks') {
        // Update group whitelist if present
        if (field.restrict_type === 'groups' && Array.isArray(field.component_group_whitelist)) {
          field.component_group_whitelist = field.component_group_whitelist
            .map((uuid: string) => groupsUuidMap.get(uuid))
            .filter(Boolean);
        }

        // Update tag whitelist if present
        if (Array.isArray(field.component_tag_whitelist)) {
          field.component_tag_whitelist = field.component_tag_whitelist
            .map((id: string | number) => tagsIdMap.get(Number(id)))
            .filter(Boolean);
        }

        // Update component whitelist if present and componentNameMap is provided
        if (Array.isArray(field.component_whitelist) && componentNameMap) {
          field.component_whitelist = field.component_whitelist
            .map((name: string) => componentNameMap.get(name))
            .filter(Boolean);
        }
      }

      // Recursively process nested fields
      updateSchemaWhitelists(field, groupsUuidMap, tagsIdMap, componentNameMap);
    }
  });
}

/**
 * Gets all groups in the hierarchy path of a given group
 */
function getGroupHierarchy(group: SpaceComponentGroup, allGroups: SpaceComponentGroup[]): SpaceComponentGroup[] {
  const hierarchy: SpaceComponentGroup[] = [group];
  let currentGroup = group;

  while (currentGroup.parent_uuid && currentGroup.parent_uuid.length > 0 && currentGroup.parent_uuid !== currentGroup.uuid) {
    const parentGroup = allGroups.find(g => g.uuid === currentGroup.parent_uuid);
    if (parentGroup) {
      hierarchy.unshift(parentGroup); // Add parent to the start of the array
      currentGroup = parentGroup;
    }
    else {
      break;
    }
  }

  return hierarchy;
}

export async function handleWhitelists(
  space: string,
  password: string,
  region: RegionCode,
  spaceData: SpaceData,
): Promise<{
    successful: string[];
    failed: Array<{ name: string; error: unknown }>;
    groupsUuidMap: Map<string, string>;
    tagsIdMap: Map<number, number>;
    componentNameMap: Map<string, string>;
    processedTagIds: Set<number>;
    processedGroupUuids: Set<string>;
    processedComponentNames: Set<string>;
  }> {
  const results = {
    successful: [] as string[],
    failed: [] as Array<{ name: string; error: unknown }>,
    groupsUuidMap: new Map<string, string>(),
    tagsIdMap: new Map<number, number>(),
    componentNameMap: new Map<string, string>(),
    processedTagIds: new Set<number>(),
    processedGroupUuids: new Set<string>(),
    processedComponentNames: new Set<string>(),
  };

  // Collect all whitelist dependencies from all components
  const allDependencies = {
    groupUuids: new Set<string>(),
    tagIds: new Set<number>(),
    componentNames: new Set<string>(),
  };

  // First, collect all direct dependencies
  spaceData.components.forEach((component) => {
    if (component.schema) {
      const deps = collectWhitelistDependencies(component.schema);
      deps.groupUuids.forEach(uuid => allDependencies.groupUuids.add(uuid));
      deps.tagIds.forEach(id => allDependencies.tagIds.add(id));
      deps.componentNames.forEach(name => allDependencies.componentNames.add(name));
    }
  });

  // Process tags first
  const whitelistTags = spaceData.internalTags.filter(tag => allDependencies.tagIds.has(tag.id));
  if (whitelistTags.length > 0) {
    const spinner = new Spinner({
      verbose: !isVitest,
    });
    spinner.start('Processing whitelist tags...');
    const tagResults = await handleTags(space, password, region, whitelistTags);
    results.successful.push(...tagResults.successful);
    results.failed.push(...tagResults.failed);
    tagResults.idMap.forEach((newId, oldId) => {
      results.tagsIdMap.set(oldId, newId);
      results.processedTagIds.add(oldId);
    });
    spinner.succeed(`Processed ${whitelistTags.length} whitelist tags`);
  }

  // Process groups - include full hierarchy of whitelisted groups
  const whitelistGroupsSet = new Set<SpaceComponentGroup>();

  // First, collect directly whitelisted groups
  const directWhitelistGroups = spaceData.groups.filter(group => allDependencies.groupUuids.has(group.uuid));

  // Then, for each whitelisted group, get its full hierarchy
  directWhitelistGroups.forEach((group) => {
    const hierarchy = getGroupHierarchy(group, spaceData.groups);
    hierarchy.forEach(g => whitelistGroupsSet.add(g));
  });

  const whitelistGroups = Array.from(whitelistGroupsSet);
  if (whitelistGroups.length > 0) {
    const spinner = new Spinner({
      verbose: !isVitest,
    });
    spinner.start('Processing whitelist groups...');
    const groupResults = await handleComponentGroups(space, password, region, whitelistGroups);
    results.successful.push(...groupResults.successful);
    results.failed.push(...groupResults.failed);
    groupResults.uuidMap.forEach((newUuid, oldUuid) => {
      results.groupsUuidMap.set(oldUuid, newUuid);
      results.processedGroupUuids.add(oldUuid);
    });
    spinner.succeed(`Processed ${whitelistGroups.length} whitelist groups`);
  }

  // Process whitelisted components last (after tags and groups are processed)
  const whitelistComponents = spaceData.components.filter(component => allDependencies.componentNames.has(component.name));
  if (whitelistComponents.length > 0) {
    const spinner = new Spinner({
      verbose: !isVitest,
    });
    spinner.start('Processing whitelisted components...');

    // Process components in dependency order
    const processedComponents = new Set<string>();
    const failedComponents = new Set<string>();

    async function processComponent(componentName: string, visited = new Set<string>()): Promise<void> {
      // Skip if already processed or failed
      if (processedComponents.has(componentName) || failedComponents.has(componentName)) {
        return;
      }

      // Skip if we detect a circular dependency
      if (visited.has(componentName)) {
        return;
      }

      visited.add(componentName);

      // Find the component
      const component = spaceData.components.find(c => c.name === componentName);
      if (!component) {
        failedComponents.add(componentName);
        results.failed.push({
          name: componentName,
          error: new Error(`Component ${componentName} not found`),
        });
        return;
      }

      // Process dependencies first
      if (component.schema) {
        const deps = collectWhitelistDependencies(component.schema);
        for (const depName of deps.componentNames) {
          await processComponent(depName, new Set(visited));
        }
      }

      // Skip if failed due to dependency failure
      if (failedComponents.has(componentName)) {
        return;
      }

      const componentSpinner = new Spinner({
        verbose: !isVitest,
      });
      componentSpinner.start(`Processing whitelisted component ${component.name}...`);

      try {
        // Update component with new tag IDs and group UUIDs before upserting
        const componentToUpdate = { ...component };

        // Map component_group_uuid if it exists
        if (component.component_group_uuid) {
          const newGroupUuid = results.groupsUuidMap.get(component.component_group_uuid);
          if (newGroupUuid) {
            componentToUpdate.component_group_uuid = newGroupUuid;
          }
        }

        // Process internal tags if they exist
        if (component.internal_tag_ids?.length > 0) {
          const processedTags: { ids: string[]; tags: SpaceComponentInternalTag[] } = {
            ids: [],
            tags: [],
          };

          // Map existing tag IDs to new ones
          for (const tagId of component.internal_tag_ids) {
            const tag = spaceData.internalTags.find(t => t.id === Number(tagId));
            if (tag) {
              const newTagId = results.tagsIdMap.get(tag.id);
              if (newTagId) {
                processedTags.ids.push(newTagId.toString());
                processedTags.tags.push({
                  ...tag,
                  id: newTagId,
                });
              }
            }
          }

          componentToUpdate.internal_tag_ids = processedTags.ids;
          componentToUpdate.internal_tags_list = processedTags.tags;
        }

        // Update schema whitelists with new IDs/UUIDs
        if (componentToUpdate.schema) {
          // Deep clone the schema to avoid modifying the original
          componentToUpdate.schema = JSON.parse(JSON.stringify(componentToUpdate.schema));
          updateSchemaWhitelists(
            componentToUpdate.schema,
            results.groupsUuidMap,
            results.tagsIdMap,
            results.componentNameMap,
          );
        }

        const updatedComponent = await upsertComponent(space, componentToUpdate, password, region);
        if (updatedComponent) {
          results.successful.push(component.name);
          results.componentNameMap.set(component.name, updatedComponent.name);
          results.processedComponentNames.add(component.name);
          processedComponents.add(component.name);
          componentSpinner.succeed(`Whitelisted component-> ${chalk.hex(colorPalette.COMPONENTS)(component.name)} - Completed in ${componentSpinner.elapsedTime.toFixed(2)}ms`);
        }
      }
      catch (error) {
        componentSpinner.failed(`Whitelisted component-> ${chalk.hex(colorPalette.COMPONENTS)(component.name)} - Failed`);
        failedComponents.add(componentName);
        results.failed.push({ name: component.name, error });
      }
    }

    // Process each whitelisted component and its dependencies
    for (const component of whitelistComponents) {
      await processComponent(component.name);
    }

    spinner.succeed(`Processed ${processedComponents.size} whitelisted components`);
  }

  return results;
}

// Update HandleComponentsOptions to include whitelist maps
interface HandleComponentsOptions {
  space: string;
  password: string;
  region: RegionCode;
  spaceData: SpaceData;
  groupsUuidMap: Map<string, string>;
  tagsIdMaps: Map<number, number>;
  componentNameMap: Map<string, string>;
}

export async function handleComponents(options: HandleComponentsOptions) {
  const {
    space,
    password,
    region,
    spaceData: { components, internalTags, presets },
    groupsUuidMap,
    tagsIdMaps,
    componentNameMap,
  } = options;

  const results = {
    successful: [] as string[],
    failed: [] as Array<{ name: string; error: unknown }>,
    componentIdMap: new Map<number, number>(),
  };

  // Helper to check if a component has whitelists in its schema
  const hasWhitelists = (schema: Record<string, any>): boolean => {
    let found = false;
    function traverse(field: Record<string, any>) {
      if (typeof field === 'object' && field !== null) {
        if (field.type === 'bloks' && (
          (field.restrict_type === 'groups' && Array.isArray(field.component_group_whitelist))
          || Array.isArray(field.component_tag_whitelist)
          || Array.isArray(field.component_whitelist)
        )) {
          found = true;
          return;
        }
        Object.values(field).forEach((value) => {
          if (typeof value === 'object' && value !== null && !found) {
            traverse(value);
          }
        });
      }
    }
    traverse(schema);
    return found;
  };

  // First pass: Create/update all components
  for (const component of components) {
    const spinner = new Spinner({
      verbose: !isVitest,
    });

    if (!component.name) {
      spinner.start(`Processing component...`);
      await delay(100);
      spinner.failed(`Component-> ${chalk.hex(colorPalette.COMPONENTS)('unknown')} is missing the name property - Failed`);
      results.failed.push({ name: 'unknown', error: new Error('Component name is required') });
      continue;
    }

    spinner.start(`Processing component ${component.name}...`);

    try {
      // Map component_group_uuid if it exists
      const componentToUpdate = { ...component };
      if (component.component_group_uuid) {
        const newGroupUuid = groupsUuidMap.get(component.component_group_uuid);
        if (newGroupUuid) {
          componentToUpdate.component_group_uuid = newGroupUuid;
        }
      }

      // Process internal tags if they exist
      if (component.internal_tag_ids?.length > 0) {
        const processedTags: { ids: string[]; tags: SpaceComponentInternalTag[] } = {
          ids: [],
          tags: [],
        };

        // Map existing tag IDs to new ones
        for (const tagId of component.internal_tag_ids) {
          const tag = internalTags.find(t => t.id === Number(tagId));
          if (tag) {
            const newTagId = tagsIdMaps.get(tag.id);
            if (newTagId) {
              processedTags.ids.push(newTagId.toString());
              processedTags.tags.push({
                ...tag,
                id: newTagId,
              });
            }
          }
        }

        componentToUpdate.internal_tag_ids = processedTags.ids;
        componentToUpdate.internal_tags_list = processedTags.tags;
      }

      // Update schema whitelists with new IDs/UUIDs if the component has whitelists
      if (componentToUpdate.schema && (hasWhitelists(componentToUpdate.schema))) {
        // Deep clone the schema to avoid modifying the original
        componentToUpdate.schema = JSON.parse(JSON.stringify(componentToUpdate.schema));
        updateSchemaWhitelists(
          componentToUpdate.schema,
          groupsUuidMap,
          tagsIdMaps,
          componentNameMap,
        );
      }

      // Upsert the component
      const updatedComponent = await upsertComponent(space, componentToUpdate, password, region);
      if (updatedComponent) {
        results.successful.push(component.name);
        results.componentIdMap.set(component.id, updatedComponent.id);
        spinner.succeed(`Component-> ${chalk.hex(colorPalette.COMPONENTS)(component.name)} - Completed in ${spinner.elapsedTime.toFixed(2)}ms`);
      }
    }
    catch (error) {
      spinner.failed(`Component-> ${chalk.hex(colorPalette.COMPONENTS)(component.name)} - Failed`);
      results.failed.push({ name: component.name, error });
    }
  }

  // Second pass: Only update components that have component_whitelist dependencies and weren't properly mapped in first pass
  const componentsWithUnmappedWhitelists = components.filter(component =>
    component.schema
    && hasWhitelists(component.schema)
    && componentNameMap
    && componentNameMap.size > 0,
  );

  if (componentsWithUnmappedWhitelists.length > 0) {
    for (const component of componentsWithUnmappedWhitelists) {
      const spinner = new Spinner({
        verbose: !isVitest,
      });
      spinner.start(`Updating component whitelists for ${component.name}...`);

      try {
        const componentToUpdate = { ...component };
        // Preserve the group mapping from the first pass
        if (component.component_group_uuid) {
          const newGroupUuid = groupsUuidMap.get(component.component_group_uuid);
          if (newGroupUuid) {
            componentToUpdate.component_group_uuid = newGroupUuid;
          }
        }

        // Update schema whitelists including component whitelists
        updateSchemaWhitelists(
          componentToUpdate.schema,
          groupsUuidMap,
          tagsIdMaps,
          componentNameMap,
        );

        // Upsert the component again with updated component whitelists
        await upsertComponent(space, componentToUpdate, password, region);
        spinner.succeed(`Component whitelists-> ${chalk.hex(colorPalette.COMPONENTS)(component.name)} - Completed in ${spinner.elapsedTime.toFixed(2)}ms`);
      }
      catch (error) {
        spinner.failed(`Component whitelists-> ${chalk.hex(colorPalette.COMPONENTS)(component.name)} - Failed`);
        results.failed.push({ name: `${component.name} (whitelist update)`, error });
      }
    }
  }

  // Finally, process presets
  for (const component of components) {
    const relatedPresets = presets.filter(preset => preset.component_id === component.id);
    if (relatedPresets.length > 0) {
      for (const preset of relatedPresets) {
        const presetSpinner = new Spinner({
          verbose: !isVitest,
        });
        presetSpinner.start(`Processing preset ${preset.name}...`);

        try {
          const newComponentId = results.componentIdMap.get(component.id);
          if (!newComponentId) {
            throw new Error(`No new ID found for component ${component.name}`);
          }

          const presetToUpdate = {
            name: preset.name,
            preset: preset.preset,
            component_id: newComponentId,
          };

          await upsertComponentPreset(space, presetToUpdate, password, region);
          presetSpinner.succeed(`Preset-> ${chalk.hex(colorPalette.COMPONENTS)(preset.name)} - Completed in ${presetSpinner.elapsedTime.toFixed(2)}ms`);
        }
        catch (error) {
          presetSpinner.failed(`Preset-> ${chalk.hex(colorPalette.COMPONENTS)(preset.name)} - Failed`);
          results.failed.push({ name: preset.name, error });
        }
      }
    }
  }

  return results;
}
