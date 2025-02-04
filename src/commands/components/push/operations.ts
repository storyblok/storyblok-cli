import { Spinner } from '@topcli/spinner';
import chalk from 'chalk';
import { colorPalette } from '../../../constants';
import { isVitest } from '../../../utils';
import type { RegionCode } from '../../../constants';
import type { SpaceComponentGroup, SpaceComponentInternalTag, SpaceData } from '../constants';
import { upsertComponent, upsertComponentGroup, upsertComponentInternalTag, upsertComponentPreset } from './actions';

export async function handleTags(space: string, password: string, region: RegionCode, spaceData: SpaceComponentInternalTag[]) {
  const results = {
    successful: [] as string[],
    failed: [] as Array<{ name: string; error: unknown }>,
    idMap: new Map<number, number>(),
  };
  await Promise.all(spaceData.map(async (tag) => {
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

export async function handleComponentGroups(space: string, password: string, region: RegionCode, spaceData: SpaceComponentGroup[]) {
  const results = {
    successful: [] as string[],
    failed: [] as Array<{ name: string; error: unknown }>,
    uuidMap: new Map<string, string>(), // Maps old UUIDs to new UUIDs
    idMap: new Map<number, number>(), // Maps old IDs to new IDs
  };

  // First, process groups without parents
  const rootGroups = spaceData.filter(group => !group.parent_uuid && !group.parent_id);
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
      if (!group.parent_uuid || !group.parent_id) { continue; }

      // Check if parent has been processed
      const newParentUuid = results.uuidMap.get(group.parent_uuid);
      const newParentId = results.idMap.get(group.parent_id);
      if (!newParentUuid || !newParentId) { continue; }

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

interface HandleComponentsOptions {
  space: string;
  password: string;
  region: RegionCode;
  spaceData: SpaceData;
  groupsUuidMap: Map<string, string>;
  tagsIdMaps: Map<number, number>;
}

export async function handleComponents(options: HandleComponentsOptions) {
  const {
    space,
    password,
    region,
    spaceData: { components, internalTags, presets },
    groupsUuidMap,
    tagsIdMaps,
  } = options;

  const results = {
    successful: [] as string[],
    failed: [] as Array<{ name: string; error: unknown }>,
  };

  for (const component of components) {
    const spinner = new Spinner({
      verbose: !isVitest,
    });
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

      // Upsert the component
      const updatedComponent = await upsertComponent(space, componentToUpdate, password, region);
      if (updatedComponent) {
        results.successful.push(component.name);
        spinner.succeed(`Component-> ${chalk.hex(colorPalette.COMPONENTS)(component.name)} - Completed in ${spinner.elapsedTime.toFixed(2)}ms`);

        // Process related presets
        const relatedPresets = presets.filter(preset => preset.component_id === component.id);
        if (relatedPresets.length > 0) {
          for (const preset of relatedPresets) {
            const presetSpinner = new Spinner({
              verbose: !isVitest,
            });
            presetSpinner.start(`Processing preset ${preset.name}...`);

            try {
              const presetToUpdate = {
                name: preset.name,
                preset: preset.preset,
                component_id: updatedComponent.id,
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
    }
    catch (error) {
      spinner.failed(`Component-> ${chalk.hex(colorPalette.COMPONENTS)(component.name)} - Failed`);
      results.failed.push({ name: component.name, error });
    }
  }

  return results;
}
