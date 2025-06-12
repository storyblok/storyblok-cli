import chalk from 'chalk';
import { colorPalette } from '../../../constants';
import type { RegionCode } from '../../../constants';
import type {
  SpaceComponent,
  SpaceComponentGroup,
  SpaceComponentInternalTag,
  SpaceComponentPreset,
  SpaceData,
} from '../constants';
import { upsertComponent, upsertComponentGroup, upsertComponentInternalTag, upsertComponentPreset } from './actions';
import { createHash } from 'node:crypto';
import { progressDisplay } from './progress-display';

// =============================================================================
// TYPE DEFINITIONS
// =============================================================================

/** Types of nodes in our dependency graph */
type NodeType = 'component' | 'group' | 'tag';

/** Data that can be stored in a graph node */
type NodeData = SpaceComponent | SpaceComponentGroup | SpaceComponentInternalTag;

/** A single node in the dependency graph */
interface DependencyNode {
  id: string; // Unique identifier like "component:hero" or "tag:123"
  type: NodeType; // What kind of resource this represents
  data: NodeData; // The actual resource data
  dependencies: Set<string>; // Resources this node depends on
  dependents: Set<string>; // Resources that depend on this node
  processed: boolean; // Whether we've successfully processed this node
}

/** The complete dependency graph */
interface DependencyGraph {
  nodes: Map<string, DependencyNode>;
}

/** Target data with content hashes for efficient comparison */
interface TargetData {
  components: Map<string, { resource: SpaceComponent; hash: string }>;
  groups: Map<string, { resource: SpaceComponentGroup; hash: string }>;
  tags: Map<string, { resource: SpaceComponentInternalTag; hash: string }>;
  presets: Map<string, { resource: SpaceComponentPreset; hash: string }>;
}

/** Results from the push operation */
interface PushResults {
  successful: string[];
  failed: Array<{ name: string; error: unknown }>;
  skipped: string[];
}

// =============================================================================
// CONTENT COMPARISON UTILITIES
// =============================================================================

/**
 * Normalizes resources for content comparison by removing fields that should differ
 * between local and target (like IDs, timestamps, etc.)
 */
function normalizeComponentForComparison(component: SpaceComponent): Partial<SpaceComponent> {
  const { id, created_at, updated_at, ...normalized } = component;
  return normalized;
}

function normalizeGroupForComparison(group: SpaceComponentGroup): Partial<SpaceComponentGroup> {
  const { id, ...normalized } = group;
  return normalized;
}

function normalizeTagForComparison(tag: SpaceComponentInternalTag): Partial<SpaceComponentInternalTag> {
  const { id, ...normalized } = tag;
  return normalized;
}

function normalizePresetForComparison(preset: SpaceComponentPreset): Partial<SpaceComponentPreset> {
  const { id, created_at, updated_at, space_id, component_id, ...normalized } = preset;
  return normalized;
}

/**
 * Recursively normalizes an object for consistent JSON stringification.
 * Sorts object keys to ensure identical objects produce identical hashes.
 */
function normalizeForHashing(obj: any): any {
  if (obj === null || obj === undefined) { return obj; }
  if (Array.isArray(obj)) { return obj.map(normalizeForHashing); }

  if (typeof obj === 'object') {
    const normalized: Record<string, any> = {};
    const sortedKeys = Object.keys(obj).sort();

    for (const key of sortedKeys) {
      normalized[key] = normalizeForHashing(obj[key]);
    }

    return normalized;
  }

  return obj; // Primitive values
}

/**
 * Generates a content hash for comparing local vs remote resources.
 * This helps us skip processing if content hasn't changed.
 */
function generateContentHash(obj: any): string {
  const normalized = normalizeForHashing(obj);
  return createHash('sha256').update(JSON.stringify(normalized)).digest('hex');
}

/**
 * Converts space state target maps to TargetData format with content hashes
 */
export function buildTargetDataFromMaps(
  components: Map<string, SpaceComponent>,
  groups: Map<string, SpaceComponentGroup>,
  tags: Map<string, SpaceComponentInternalTag>,
  presets: Map<string, SpaceComponentPreset>,
): TargetData {
  const targetData: TargetData = {
    components: new Map(),
    groups: new Map(),
    tags: new Map(),
    presets: new Map(),
  };

  // Build hash maps for each resource type
  components.forEach((component) => {
    const normalized = normalizeComponentForComparison(component);
    const hash = generateContentHash(normalized);
    targetData.components.set(component.name, { resource: component, hash });
  });

  groups.forEach((group) => {
    const normalized = normalizeGroupForComparison(group);
    const hash = generateContentHash(normalized);
    targetData.groups.set(group.name, { resource: group, hash });
  });

  presets.forEach((preset) => {
    const normalized = normalizePresetForComparison(preset);
    const hash = generateContentHash(normalized);
    targetData.presets.set(preset.name, { resource: preset, hash });
  });

  tags.forEach((tag) => {
    const normalized = normalizeTagForComparison(tag);
    const hash = generateContentHash(normalized);
    targetData.tags.set(tag.name, { resource: tag, hash });
  });

  console.log(`Found ${targetData.components.size} components, ${targetData.groups.size} groups, ${targetData.tags.size} tags, ${targetData.presets.size} presets`);
  return targetData;
}

// =============================================================================
// DEPENDENCY COLLECTION UTILITIES
// =============================================================================

/**
 * Extracts all whitelist dependencies from a component's schema.
 * This traverses the schema recursively to find all blok fields that
 * reference other components, groups, or tags.
 */
function collectWhitelistDependencies(schema: Record<string, any>): {
  groupUuids: Set<string>;
  tagIds: Set<number>;
  componentNames: Set<string>;
} {
  const dependencies = {
    groupUuids: new Set<string>(),
    tagIds: new Set<number>(),
    componentNames: new Set<string>(),
  };

  function traverseField(field: Record<string, any>) {
    if (typeof field !== 'object' || field === null) { return; }

    // Look for blok fields that can contain whitelists
    if (field.type === 'bloks') {
      // Group whitelists (restrict_type: 'groups')
      if (field.restrict_type === 'groups' && Array.isArray(field.component_group_whitelist)) {
        field.component_group_whitelist.forEach((uuid: string) => {
          if (uuid?.length > 0) { dependencies.groupUuids.add(uuid); }
        });
      }

      // Tag whitelists
      if (Array.isArray(field.component_tag_whitelist)) {
        field.component_tag_whitelist.forEach((id: string | number) => {
          if (id) { dependencies.tagIds.add(Number(id)); }
        });
      }

      // Component whitelists
      if (Array.isArray(field.component_whitelist)) {
        field.component_whitelist.forEach((name: string) => {
          if (name && typeof name === 'string') {
            dependencies.componentNames.add(name);
          }
        });
      }
    }

    // Recursively check nested fields
    Object.values(field).forEach((value) => {
      if (typeof value === 'object' && value !== null) {
        traverseField(value);
      }
    });
  }

  traverseField(schema);
  return dependencies;
}

// =============================================================================
// DEPENDENCY GRAPH CONSTRUCTION
// =============================================================================

/**
 * Builds a complete dependency graph from space data.
 * This creates nodes for all resources and establishes dependency relationships.
 */
function buildDependencyGraph(spaceData: SpaceData): DependencyGraph {
  const graph: DependencyGraph = { nodes: new Map() };

  // Create tag nodes
  spaceData.internalTags.forEach((tag) => {
    graph.nodes.set(`tag:${tag.id}`, {
      id: `tag:${tag.id}`,
      type: 'tag',
      data: tag,
      dependencies: new Set(),
      dependents: new Set(),
      processed: false,
    });
  });

  // Create group nodes
  spaceData.groups.forEach((group) => {
    graph.nodes.set(`group:${group.uuid}`, {
      id: `group:${group.uuid}`,
      type: 'group',
      data: group,
      dependencies: new Set(),
      dependents: new Set(),
      processed: false,
    });
  });

  // Create component nodes
  spaceData.components.forEach((component) => {
    graph.nodes.set(`component:${component.name}`, {
      id: `component:${component.name}`,
      type: 'component',
      data: component,
      dependencies: new Set(),
      dependents: new Set(),
      processed: false,
    });
  });

  // Helper to add a dependency relationship between two nodes
  function addDependency(dependentId: string, dependencyId: string) {
    const dependent = graph.nodes.get(dependentId);
    const dependency = graph.nodes.get(dependencyId);

    if (dependent && dependency) {
      dependent.dependencies.add(dependencyId);
      dependency.dependents.add(dependentId);
    }
  }

  // Build component dependencies
  spaceData.components.forEach((component) => {
    const componentId = `component:${component.name}`;

    // Direct group assignment (component belongs to a group)
    if (component.component_group_uuid) {
      addDependency(componentId, `group:${component.component_group_uuid}`);
    }

    // Direct tag assignments (component is tagged)
    component.internal_tag_ids?.forEach((tagId) => {
      addDependency(componentId, `tag:${Number(tagId)}`);
    });

    // Schema whitelist dependencies
    if (component.schema) {
      const deps = collectWhitelistDependencies(component.schema);

      deps.componentNames.forEach((name) => {
        addDependency(componentId, `component:${name}`);
      });

      deps.groupUuids.forEach((uuid) => {
        addDependency(componentId, `group:${uuid}`);
      });

      deps.tagIds.forEach((id) => {
        addDependency(componentId, `tag:${id}`);
      });
    }
  });

  // Build group hierarchy dependencies (child groups depend on parent groups)
  spaceData.groups.forEach((group) => {
    if (group.parent_uuid && group.parent_uuid !== group.uuid) {
      addDependency(`group:${group.uuid}`, `group:${group.parent_uuid}`);
    }
  });

  return graph;
}

// =============================================================================
// CYCLE DETECTION
// =============================================================================

/**
 * Detects problematic circular dependencies using depth-first search.
 * Component-to-component cycles (whitelists) are allowed and ignored.
 * Group hierarchy cycles and mixed cycles are reported as errors.
 */
function detectProblematicCycles(graph: DependencyGraph): string[] {
  const visited = new Set<string>();
  const recursionStack = new Set<string>();
  const problematicCycles: string[] = [];

  function dfs(nodeId: string, path: string[]): boolean {
    // If we've seen this node in our current path, we found a cycle
    if (recursionStack.has(nodeId)) {
      const cycleStart = path.indexOf(nodeId);
      const cycle = path.slice(cycleStart).concat(nodeId);

      // Check if this cycle only involves component-to-component dependencies
      const isComponentOnlyCycle = cycle.every(id => id.startsWith('component:'));

      if (!isComponentOnlyCycle) {
        // This cycle involves groups or tags - it's problematic
        problematicCycles.push(cycle.join(' → '));
      }

      return !isComponentOnlyCycle; // Return true only for problematic cycles
    }

    // Skip if already fully processed
    if (visited.has(nodeId)) { return false; }

    // Mark as visited and add to current path
    visited.add(nodeId);
    recursionStack.add(nodeId);

    // Check dependencies
    const node = graph.nodes.get(nodeId);
    if (node) {
      for (const depId of node.dependencies) {
        if (dfs(depId, [...path, nodeId])) {
          return true;
        }
      }
    }

    // Remove from current path when backtracking
    recursionStack.delete(nodeId);
    return false;
  }

  // Check all nodes for problematic cycles
  for (const nodeId of graph.nodes.keys()) {
    if (!visited.has(nodeId)) {
      dfs(nodeId, []);
    }
  }

  return problematicCycles;
}

/**
 * Detects circular component whitelist relationships for informational purposes.
 * These cycles are allowed but good to know about.
 */
function detectCircularWhitelists(graph: DependencyGraph): string[] {
  const visited = new Set<string>();
  const recursionStack = new Set<string>();
  const componentCycles: string[] = [];

  function dfs(nodeId: string, path: string[]): boolean {
    if (recursionStack.has(nodeId)) {
      const cycleStart = path.indexOf(nodeId);
      const cycle = path.slice(cycleStart).concat(nodeId);

      // Only report component-only cycles with more than one component
      if (cycle.every(id => id.startsWith('component:')) && cycle.length > 1) {
        const componentNames = cycle.map(id => id.replace('component:', ''));
        componentCycles.push(componentNames.join(' ↔ '));
      }

      return false; // Don't treat as error
    }

    if (visited.has(nodeId)) { return false; }

    visited.add(nodeId);
    recursionStack.add(nodeId);

    // Only follow component-to-component dependencies
    const node = graph.nodes.get(nodeId);
    if (node && nodeId.startsWith('component:')) {
      for (const depId of node.dependencies) {
        if (depId.startsWith('component:')) {
          dfs(depId, [...path, nodeId]);
        }
      }
    }

    recursionStack.delete(nodeId);
    return false;
  }

  // Check all component nodes
  for (const nodeId of graph.nodes.keys()) {
    if (nodeId.startsWith('component:') && !visited.has(nodeId)) {
      dfs(nodeId, []);
    }
  }

  return componentCycles;
}

// =============================================================================
// PROCESSING ORDER DETERMINATION
// =============================================================================

/**
 * Performs topological sorting to determine the optimal processing order.
 * Returns levels where each level can be processed in parallel.
 */
function determineProcessingOrder(graph: DependencyGraph): string[][] {
  const inDegree = new Map<string, number>();

  // Calculate how many dependencies each node has
  graph.nodes.forEach((node, nodeId) => {
    inDegree.set(nodeId, node.dependencies.size);
  });

  const levels: string[][] = [];

  // Find nodes with no dependencies (can be processed first)
  let currentLevel = [...inDegree.entries()]
    .filter(([_, degree]) => degree === 0)
    .map(([nodeId, _]) => nodeId);

  while (currentLevel.length > 0) {
    levels.push(currentLevel);
    const nextLevel: string[] = [];

    // For each node we're processing in this level
    for (const nodeId of currentLevel) {
      const node = graph.nodes.get(nodeId)!;

      // Reduce dependency count for all nodes that depend on this one
      for (const dependentId of node.dependents) {
        const currentDegree = inDegree.get(dependentId)!;
        const newDegree = currentDegree - 1;
        inDegree.set(dependentId, newDegree);

        // If all dependencies are satisfied, add to next level
        if (newDegree === 0) {
          nextLevel.push(dependentId);
        }
      }
    }

    currentLevel = nextLevel;
  }

  return levels;
}

// =============================================================================
// RESOURCE PROCESSING
// =============================================================================

/**
 * Processes a single node (component, group, or tag).
 * Updates references to use new IDs and uploads to the target space.
 * Uses content comparison to skip identical resources for performance.
 */
async function processNode(
  nodeId: string,
  graph: DependencyGraph,
  space: string,
  targetData?: TargetData,
): Promise<{ result: any; skipped: boolean }> {
  const node = graph.nodes.get(nodeId)!;

  switch (node.type) {
    case 'tag': {
      const tag = node.data as SpaceComponentInternalTag;

      // Check if tag exists and compare content hash
      if (targetData) {
        const existingEntry = targetData.tags.get(tag.name);
        if (existingEntry) {
          const normalized = normalizeTagForComparison(tag);
          const localHash = generateContentHash(normalized);

          if (localHash === existingEntry.hash) {
            // Content is identical, but we still need to update references if IDs differ
            const targetId = existingEntry.resource.id;
            const currentId = tag.id;

            if (currentId !== targetId) {
              // Update the node's data with the target ID
              (node.data as SpaceComponentInternalTag).id = targetId;
              console.log(`🏷️  Tag ${tag.name}: updated references from local ID ${currentId} to target ID ${targetId}`);

              // Update all dependent nodes that reference this tag
              updateDependentTagReferences(graph, node.id, currentId, targetId);
            }

            return { result: existingEntry.resource, skipped: true };
          }
          // Content differs, continue with update but preserve target ID
          tag.id = existingEntry.resource.id;
        }
      }

      const existingId = targetData?.tags.get(tag.name)?.resource.id;
      const result = await upsertComponentInternalTag(space, tag, existingId);

      if (result) {
        // Update the node's data with the new server ID
        const oldTagId = (node.data as SpaceComponentInternalTag).id;
        (node.data as SpaceComponentInternalTag).id = result.id;

        // Update all dependent nodes that reference this tag
        updateDependentTagReferences(graph, node.id, oldTagId, result.id);
      }

      // Update target data with new hash for future comparisons
      if (targetData && result) {
        const normalized = normalizeTagForComparison(result);
        const newHash = generateContentHash(normalized);
        targetData.tags.set(result.name, { resource: result, hash: newHash });
      }

      return { result, skipped: false };
    }

    case 'group': {
      // Use the current data from the graph (which has updated references)
      const group = node.data as SpaceComponentGroup;
      const originalUuid = group.uuid; // Capture the original UUID before any modifications

      // Check if group exists and compare content hash
      if (targetData) {
        const existingEntry = targetData.groups.get(group.name);

        if (existingEntry) {
          const normalized = normalizeGroupForComparison(group);
          const localHash = generateContentHash(normalized);
          if (localHash === existingEntry.hash) {
            // Content is identical, but we still need to update references if UUIDs differ
            const targetUuid = existingEntry.resource.uuid;
            const currentUuid = group.uuid;

            if (currentUuid !== targetUuid) {
              // Update the node's data with the target UUID
              (node.data as SpaceComponentGroup).uuid = targetUuid;
              (node.data as SpaceComponentGroup).id = existingEntry.resource.id;
              console.log(`📁 Group ${group.name}: updated references from local UUID ${currentUuid} to target UUID ${targetUuid}`);

              // Update all dependent nodes that reference this group
              updateDependentGroupReferences(graph, node.id, currentUuid, targetUuid);
            }

            return { result: existingEntry.resource, skipped: true };
          }
          // Content differs, continue with update but preserve target UUIDs
          group.id = existingEntry.resource.id;
          group.uuid = existingEntry.resource.uuid;
        }
      }

      const existingId = targetData?.groups.get(group.name)?.resource.id;
      const result = await upsertComponentGroup(space, group, existingId);

      if (result) {
        // Update the node's data with the new server UUID
        (node.data as SpaceComponentGroup).uuid = result.uuid;
        (node.data as SpaceComponentGroup).id = result.id;

        // Always update dependent references if the original UUID differs from result
        if (originalUuid !== result.uuid) {
          updateDependentGroupReferences(graph, node.id, originalUuid, result.uuid);
        }
      }

      // Update target data with new hash for future comparisons
      if (targetData && result) {
        const normalized = normalizeGroupForComparison(result);
        const newHash = generateContentHash(normalized);
        targetData.groups.set(result.name, { resource: result, hash: newHash });
      }

      return { result, skipped: false };
    }

    case 'component': {
      // Use the current data from the graph (which has updated references)
      const component = node.data as SpaceComponent;

      // Check if component exists and compare content hash
      if (targetData) {
        const existingEntry = targetData.components.get(component.name);
        if (existingEntry) {
          const normalized = normalizeComponentForComparison(component);
          const localHash = generateContentHash(normalized);

          if (localHash === existingEntry.hash) {
            // Content is identical, skip
            return { result: existingEntry.resource, skipped: true };
          }
          // Content differs, continue with update but preserve target ID
          component.id = existingEntry.resource.id;
        }
      }

      const existingId = targetData?.components.get(component.name)?.resource.id;
      const result = await upsertComponent(space, component, existingId);

      if (result) {
        // Update the node's data with the new server values
        const oldName = (node.data as SpaceComponent).name;
        (node.data as SpaceComponent).name = result.name;
        (node.data as SpaceComponent).id = result.id;

        // Update all dependent nodes that reference this component
        if (oldName !== result.name) {
          updateDependentComponentReferences(graph, node.id, oldName, result.name);
        }
      }

      // Update target data with new hash for future comparisons
      if (targetData && result) {
        const normalized = normalizeComponentForComparison(result);
        const newHash = generateContentHash(normalized);
        targetData.components.set(result.name, { resource: result, hash: newHash });
      }

      return { result, skipped: false };
    }

    default:
      throw new Error(`Unknown node type: ${node.type}`);
  }
}

/**
 * Updates all nodes that depend on a tag when the tag gets a new ID
 */
function updateDependentTagReferences(graph: DependencyGraph, tagNodeId: string, oldTagId: number, newTagId: number): void {
  const tagNode = graph.nodes.get(tagNodeId);
  if (!tagNode) { return; }

  // Update all components that reference this tag
  tagNode.dependents.forEach((dependentId) => {
    const dependentNode = graph.nodes.get(dependentId);
    if (!dependentNode || dependentNode.type !== 'component') { return; }

    const component = dependentNode.data as SpaceComponent;

    // Update direct tag assignments
    if (component.internal_tag_ids?.length > 0) {
      component.internal_tag_ids = component.internal_tag_ids.map((tagId) => {
        return Number(tagId) === oldTagId ? newTagId.toString() : tagId;
      });
    }

    // Update schema whitelist references
    if (component.schema) {
      updateSchemaTagReferences(component.schema, oldTagId, newTagId);
    }
  });
}

/**
 * Updates all nodes that depend on a group when the group gets a new UUID
 */
function updateDependentGroupReferences(graph: DependencyGraph, groupNodeId: string, oldGroupUuid: string, newGroupUuid: string): void {
  const groupNode = graph.nodes.get(groupNodeId);
  if (!groupNode) { return; }

  // Update all components and groups that reference this group
  groupNode.dependents.forEach((dependentId) => {
    const dependentNode = graph.nodes.get(dependentId);
    if (!dependentNode) { return; }

    if (dependentNode.type === 'component') {
      const component = dependentNode.data as SpaceComponent;

      // Update direct group assignment
      if (component.component_group_uuid === oldGroupUuid) {
        component.component_group_uuid = newGroupUuid;
      }

      // Update schema whitelist references
      if (component.schema) {
        updateSchemaGroupReferences(component.schema, oldGroupUuid, newGroupUuid);
      }
    }
    else if (dependentNode.type === 'group') {
      const group = dependentNode.data as SpaceComponentGroup;

      // Update parent group reference
      if (group.parent_uuid === oldGroupUuid) {
        group.parent_uuid = newGroupUuid;

        // We also need to update parent_id by finding the group with the new UUID
        // Look for the group node with the new UUID to get its ID
        for (const [nodeId, node] of graph.nodes) {
          if (node.type === 'group' && nodeId.startsWith('group:')) {
            const parentGroup = node.data as SpaceComponentGroup;
            if (parentGroup.uuid === newGroupUuid) {
              group.parent_id = parentGroup.id;
              break;
            }
          }
        }
      }
    }
  });
}

/**
 * Updates all nodes that depend on a component when the component gets a new name
 */
function updateDependentComponentReferences(graph: DependencyGraph, componentNodeId: string, oldComponentName: string, newComponentName: string): void {
  const componentNode = graph.nodes.get(componentNodeId);
  if (!componentNode) { return; }

  // Update all components that reference this component in whitelists
  componentNode.dependents.forEach((dependentId) => {
    const dependentNode = graph.nodes.get(dependentId);
    if (!dependentNode || dependentNode.type !== 'component') { return; }

    const component = dependentNode.data as SpaceComponent;

    // Update schema whitelist references
    if (component.schema) {
      updateSchemaComponentReferences(component.schema, oldComponentName, newComponentName);
    }
  });
}

/**
 * Helper functions to update schema references
 */
function updateSchemaTagReferences(schema: Record<string, any>, oldTagId: number, newTagId: number): void {
  function traverseField(field: Record<string, any>) {
    if (typeof field !== 'object' || field === null) { return; }

    if (field.type === 'bloks' && Array.isArray(field.component_tag_whitelist)) {
      field.component_tag_whitelist = field.component_tag_whitelist.map((id: string | number) => {
        return Number(id) === oldTagId ? newTagId : Number(id);
      });
    }

    Object.values(field).forEach((value) => {
      if (typeof value === 'object' && value !== null) {
        traverseField(value);
      }
    });
  }

  Object.values(schema).forEach((field) => {
    if (typeof field === 'object' && field !== null) {
      traverseField(field);
    }
  });
}

function updateSchemaGroupReferences(schema: Record<string, any>, oldGroupUuid: string, newGroupUuid: string): void {
  function traverseField(field: Record<string, any>) {
    if (typeof field !== 'object' || field === null) { return; }

    if (field.type === 'bloks' && field.restrict_type === 'groups' && Array.isArray(field.component_group_whitelist)) {
      field.component_group_whitelist = field.component_group_whitelist.map((uuid: string) => {
        return uuid === oldGroupUuid ? newGroupUuid : uuid;
      });
    }

    Object.values(field).forEach((value) => {
      if (typeof value === 'object' && value !== null) {
        traverseField(value);
      }
    });
  }

  Object.values(schema).forEach((field) => {
    if (typeof field === 'object' && field !== null) {
      traverseField(field);
    }
  });
}

function updateSchemaComponentReferences(schema: Record<string, any>, oldComponentName: string, newComponentName: string): void {
  function traverseField(field: Record<string, any>) {
    if (typeof field !== 'object' || field === null) { return; }

    if (field.type === 'bloks' && Array.isArray(field.component_whitelist)) {
      field.component_whitelist = field.component_whitelist.map((name: string) => {
        return name === oldComponentName ? newComponentName : name;
      });
    }

    Object.values(field).forEach((value) => {
      if (typeof value === 'object' && value !== null) {
        traverseField(value);
      }
    });
  }

  Object.values(schema).forEach((field) => {
    if (typeof field === 'object' && field !== null) {
      traverseField(field);
    }
  });
}

// =============================================================================
// LEVEL PROCESSING
// =============================================================================

/**
 * Processes a level of nodes with controlled concurrency.
 * All nodes in a level can be processed in parallel since they don't depend on each other.
 */
async function processLevel(
  level: string[],
  graph: DependencyGraph,
  space: string,
  maxConcurrency: number = 5,
  targetData?: TargetData,
): Promise<{ successful: string[]; failed: Array<{ name: string; error: unknown }>; skipped: string[] }> {
  const successful: string[] = [];
  const failed: Array<{ name: string; error: unknown }> = [];
  const skipped: string[] = [];

  // Process in batches to control concurrent API calls
  for (let i = 0; i < level.length; i += maxConcurrency) {
    const batch = level.slice(i, i + maxConcurrency);

    const batchPromises = batch.map(async (nodeId) => {
      const node = graph.nodes.get(nodeId)!;
      const displayName = getNodeDisplayName(node);

      try {
        const { result, skipped: wasSkipped } = await processNode(nodeId, graph, space, targetData);

        if (result) {
          node.processed = true;

          if (wasSkipped) {
            skipped.push(nodeId);
            progressDisplay.handleEvent({
              type: 'skip',
              name: displayName,
              resourceType: node.type,
            });
          }
          else {
            successful.push(nodeId);
            const color = getNodeColor(node.type);
            progressDisplay.handleEvent({
              type: 'success',
              name: displayName,
              resourceType: node.type,
              color,
            });
          }
        }
        else {
          throw new Error(`Failed to process ${node.type} ${displayName}`);
        }
      }
      catch (error) {
        failed.push({ name: nodeId, error });
        const color = getNodeColor(node.type);
        const label = capitalize(node.type);
        // Clear the progress line, show the result, then we'll redraw the progress line
        process.stdout.write(`\r${' '.repeat(80)}\r`);
        console.log(`✗ ${label}→ ${chalk.hex(color)(displayName)} - Failed`);
      }
    });

    // Wait for current batch before starting next
    await Promise.allSettled(batchPromises);
  }

  return { successful, failed, skipped };
}

// =============================================================================
// PRESET PROCESSING
// =============================================================================

/**
 * Processes component presets after all components have been created.
 * Updates preset component_id references to use new component IDs.
 */
async function processPresetsWithProgress(
  spaceData: SpaceData,
  space: string,
  password: string,
  region: RegionCode,
  graph: DependencyGraph,
  targetData?: TargetData,
): Promise<{ successful: string[]; failed: Array<{ name: string; error: unknown }>; skipped: string[] }> {
  const successful: string[] = [];
  const failed: Array<{ name: string; error: unknown }> = [];
  const skipped: string[] = [];

  for (const preset of spaceData.presets) {
    try {
      // Check if preset exists and compare content hash
      if (targetData) {
        const existingEntry = targetData.presets.get(preset.name);
        if (existingEntry) {
          // Find the component in the graph to get its current ID
          let newComponentId = preset.component_id;
          for (const [nodeId, node] of graph.nodes) {
            if (node.type === 'component') {
              const component = node.data as SpaceComponent;
              // Match by original ID to find the right component
              if (nodeId === `component:${preset.name}` || component.id === preset.component_id) {
                newComponentId = component.id;
                break;
              }
            }
          }

          // Create a temporary preset with updated component_id for comparison
          const tempPreset = { ...preset };
          tempPreset.component_id = newComponentId;

          const normalized = normalizePresetForComparison(tempPreset);
          const localHash = generateContentHash(normalized);

          if (localHash === existingEntry.hash) {
          // Content is identical, skip
            skipped.push(preset.name);
            progressDisplay.handleEvent({
              type: 'skip',
              name: preset.name,
              resourceType: 'preset',
            });
            continue;
          }
        }
      }

      // Find the component in the graph to get its current ID
      let newComponentId: number | undefined;
      for (const [nodeId, node] of graph.nodes) {
        if (node.type === 'component') {
          const component = node.data as SpaceComponent;
          // Match by original component ID or name
          if (component.id === preset.component_id || nodeId.endsWith(preset.name)) {
            newComponentId = component.id;
            break;
          }
        }
      }

      if (!newComponentId) {
        throw new Error(`No component found for preset ${preset.name} with component ID ${preset.component_id}`);
      }

      const presetToUpdate = {
        name: preset.name,
        preset: preset.preset,
        component_id: newComponentId,
      };

      const existingId = targetData?.presets.get(preset.name)?.resource.id;
      const result = await upsertComponentPreset(space, presetToUpdate, password, region, existingId);
      successful.push(preset.name);
      progressDisplay.handleEvent({
        type: 'success',
        name: preset.name,
        resourceType: 'preset',
        color: colorPalette.COMPONENTS,
      });

      // Update target data with new hash for future comparisons
      if (targetData && result) {
        const normalized = normalizePresetForComparison(result);
        const newHash = generateContentHash(normalized);
        targetData.presets.set(result.name, { resource: result, hash: newHash });
      }
    }
    catch (error) {
      failed.push({ name: preset.name, error });
      progressDisplay.handleEvent({
        type: 'error',
        name: preset.name,
        resourceType: 'preset',
        error,
      });
    }
  }

  return { successful, failed, skipped };
}

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

/** Gets display name for a node */
function getNodeDisplayName(node: DependencyNode): string {
  switch (node.type) {
    case 'component': return (node.data as SpaceComponent).name;
    case 'group': return (node.data as SpaceComponentGroup).name;
    case 'tag': return (node.data as SpaceComponentInternalTag).name;
    default: return 'unknown';
  }
}

/** Gets color for a node type */
function getNodeColor(type: NodeType): string {
  switch (type) {
    case 'component': return colorPalette.COMPONENTS;
    case 'group': return '#4ade80'; // green
    case 'tag': return '#fbbf24'; // yellow
    default: return '#ffffff';
  }
}

/** Capitalizes first letter of a string */
function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// =============================================================================
// MAIN EXPORT FUNCTION
// =============================================================================

/**
 * Main function to push components using graph-based dependency resolution.
 * This approach builds a complete dependency graph, detects cycles, and processes
 * resources in the optimal order to handle complex interdependencies.
 *
 * Performance features:
 * - Content-based comparison and skipping
 * - Hash-based change detection
 * - Intelligent batching and concurrency control
 * - Target space integration to prevent duplicates
 */
export async function pushWithDependencyGraph(
  space: string,
  password: string,
  region: RegionCode,
  spaceData: SpaceData,
  targetData: TargetData,
  maxConcurrency: number = 5,
): Promise<PushResults> {
  // Build the dependency graph
  const graph = buildDependencyGraph(spaceData);
  console.log(`📊 Built dependency graph with ${graph.nodes.size} nodes`);

  // Check for problematic cycles
  const problematicCycles = detectProblematicCycles(graph);
  if (problematicCycles.length > 0) {
    throw new Error(`❌ Problematic cycles detected:\n${problematicCycles.join('\n')}`);
  }

  // Report circular whitelists (informational)
  const circularWhitelists = detectCircularWhitelists(graph);
  if (circularWhitelists.length > 0) {
    console.log(`Circular component whitelists detected (allowed): ${circularWhitelists.join(', ')}`);
  }

  // Target data is already provided - no need to fetch again

  // Determine processing order
  const levels = determineProcessingOrder(graph);

  // Process each level with unified progress tracking
  const results: PushResults = {
    successful: [],
    failed: [],
    skipped: [],
  };

  // Calculate total resources for progress tracking
  const totalResources = levels.reduce((sum, level) => sum + level.length, 0) + spaceData.presets.length;

  // Initialize progress display
  progressDisplay.start(totalResources);

  for (let i = 0; i < levels.length; i++) {
    const level = levels[i];

    const levelResults = await processLevel(level, graph, space, maxConcurrency, targetData);

    results.successful.push(...levelResults.successful);
    results.failed.push(...levelResults.failed);
    results.skipped.push(...levelResults.skipped);
  }

  // Show completion summary using progress display
  progressDisplay.handleEvent({
    type: 'complete',
    summary: {
      updated: results.successful.length,
      unchanged: results.skipped.length,
      failed: results.failed.length,
    },
  });

  // Process presets (they depend on components being created first)
  if (spaceData.presets.length > 0) {
    const presetResults = await processPresetsWithProgress(spaceData, space, password, region, graph, targetData);
    results.successful.push(...presetResults.successful);
    results.failed.push(...presetResults.failed);
    results.skipped.push(...presetResults.skipped);
  }

  return results;
}
