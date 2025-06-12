import type { RegionCode } from '../../../../constants';
import type {
  SpaceComponent,
  SpaceComponentGroup,
  SpaceComponentInternalTag,
  SpaceData,
} from '../../constants';
import type { DependencyGraph, SchemaDependencies, TargetData } from './types';
import { GraphNode } from './types';
import { upsertComponent, upsertComponentGroup, upsertComponentInternalTag } from '../actions';
import {
  generateContentHash,
  normalizeComponentForComparison,
  normalizeGroupForComparison,
  normalizeTagForComparison,
} from './comparison-utils';

// =============================================================================
// CONCRETE NODE IMPLEMENTATIONS
// =============================================================================

class TagNode extends GraphNode {
  constructor(id: string, data: SpaceComponentInternalTag) {
    super(id, 'tag', data);
  }

  normalize(): any {
    return normalizeTagForComparison(this.data as SpaceComponentInternalTag);
  }

  resolveReferences(targetData: TargetData, graph: DependencyGraph): void {
    const tag = this.data as SpaceComponentInternalTag;
    const existing = targetData.tags.get(tag.name);

    if (existing && tag.id !== existing.resource.id) {
      const oldId = tag.id;
      tag.id = existing.resource.id;

      // Update dependent nodes that reference this tag
      this.updateDependentTagReferences(graph, oldId, tag.id);
    }
  }

  shouldSkip(targetData: TargetData): boolean {
    const existing = targetData.tags.get(this.getName());
    if (!existing) { return false; }

    const localHash = generateContentHash(this.normalize());
    return localHash === existing.hash;
  }

  async upsert(
    space: string,
    password: string,
    region: RegionCode,
    targetData: TargetData,
  ): Promise<SpaceComponentInternalTag> {
    const tag = this.data as SpaceComponentInternalTag;
    const existingId = targetData.tags.get(tag.name)?.resource.id;
    const result = await upsertComponentInternalTag(space, tag, existingId);

    if (!result) {
      throw new Error(`Failed to upsert tag ${tag.name}`);
    }

    // Update the node's data with the new server ID
    if (result.id !== tag.id) {
      tag.id = result.id;
    }

    return result;
  }

  updateTargetData(result: SpaceComponentInternalTag, targetData: TargetData): void {
    const normalized = this.normalize();
    const newHash = generateContentHash(normalized);
    targetData.tags.set(result.name, { resource: result, hash: newHash });
  }

  private updateDependentTagReferences(graph: DependencyGraph, oldTagId: number, newTagId: number): void {
    // Update all components that depend on this tag
    this.dependents.forEach((dependentId) => {
      const dependentNode = graph.nodes.get(dependentId);
      if (dependentNode && dependentNode.type === 'component') {
        const component = dependentNode.getData<SpaceComponent>();
        if (component.schema) {
          this.updateSchemaTagReferences(component.schema, oldTagId, newTagId);
        }
      }
    });
  }

  private updateSchemaTagReferences(schema: Record<string, any>, oldTagId: number, newTagId: number): void {
    function traverseField(field: Record<string, any>) {
      if (field.type === 'bloks' && field.component_tag_whitelist && Array.isArray(field.component_tag_whitelist)) {
        const index = field.component_tag_whitelist.indexOf(oldTagId);
        if (index !== -1) {
          field.component_tag_whitelist[index] = newTagId;
        }
      }

      // Recursively traverse nested fields
      Object.values(field).forEach((value) => {
        if (Array.isArray(value)) {
          value.forEach((item) => {
            if (typeof item === 'object' && item !== null) {
              traverseField(item);
            }
          });
        }
        else if (typeof value === 'object' && value !== null) {
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
}

class GroupNode extends GraphNode {
  constructor(id: string, data: SpaceComponentGroup) {
    super(id, 'group', data);
  }

  normalize(): any {
    return normalizeGroupForComparison(this.data as SpaceComponentGroup);
  }

  resolveReferences(targetData: TargetData, graph: DependencyGraph): void {
    const group = this.data as SpaceComponentGroup;

    // Resolve group ID/UUID if it exists in target
    const existing = targetData.groups.get(group.name);
    if (existing && group.uuid !== existing.resource.uuid) {
      const oldUuid = group.uuid;
      group.uuid = existing.resource.uuid;
      group.id = existing.resource.id;

      // Update dependent nodes that reference this group
      this.updateDependentGroupReferences(graph, oldUuid, group.uuid);
    }

    // Resolve parent group references
    if (group.parent_uuid) {
      // Find the parent group node using the node ID format
      const parentGroupNodeId = `group:${group.parent_uuid}`;
      const parentGroupNode = graph.nodes.get(parentGroupNodeId);

      if (parentGroupNode) {
        const parentGroupName = parentGroupNode.getName();
        const targetParentGroup = targetData.groups.get(parentGroupName);

        if (targetParentGroup) {
          // Use the target space parent group ID and UUID
          group.parent_id = targetParentGroup.resource.id;
          group.parent_uuid = targetParentGroup.resource.uuid;
        }
        else {
          // Parent group will be processed in the same level or was processed in a previous level
          const currentParentGroup = parentGroupNode.getData<SpaceComponentGroup>();
          group.parent_uuid = currentParentGroup.uuid;
          group.parent_id = null; // API will resolve correct parent_id via parent_uuid
        }
      }
    }
  }

  shouldSkip(targetData: TargetData): boolean {
    const existing = targetData.groups.get(this.getName());
    if (!existing) { return false; }

    const localHash = generateContentHash(this.normalize());
    return localHash === existing.hash;
  }

  async upsert(
    space: string,
    password: string,
    region: RegionCode,
    targetData: TargetData,
  ): Promise<SpaceComponentGroup> {
    const group = this.data as SpaceComponentGroup;
    const existingId = targetData.groups.get(group.name)?.resource.id;
    const result = await upsertComponentGroup(space, group, existingId);

    if (!result) {
      throw new Error(`Failed to upsert group ${group.name}`);
    }

    // Update the node's data with the new server UUID
    if (result.uuid !== group.uuid) {
      group.uuid = result.uuid;
      group.id = result.id;
    }

    return result;
  }

  updateTargetData(result: SpaceComponentGroup, targetData: TargetData): void {
    const normalized = this.normalize();
    const newHash = generateContentHash(normalized);
    targetData.groups.set(result.name, { resource: result, hash: newHash });
  }

  private updateDependentGroupReferences(graph: DependencyGraph, oldGroupUuid: string, newGroupUuid: string): void {
    // Update components and groups that depend on this group
    this.dependents.forEach((dependentId) => {
      const dependentNode = graph.nodes.get(dependentId);
      if (!dependentNode) { return; }

      if (dependentNode.type === 'component') {
        const component = dependentNode.getData<SpaceComponent>();
        if (component.schema) {
          this.updateSchemaGroupReferences(component.schema, oldGroupUuid, newGroupUuid);
        }
      }
      else if (dependentNode.type === 'group') {
        const dependentGroup = dependentNode.getData<SpaceComponentGroup>();
        if (dependentGroup.parent_uuid === oldGroupUuid) {
          dependentGroup.parent_uuid = newGroupUuid;
        }
      }
    });
  }

  private updateSchemaGroupReferences(schema: Record<string, any>, oldGroupUuid: string, newGroupUuid: string): void {
    function traverseField(field: Record<string, any>) {
      if (field.type === 'bloks' && field.component_group_whitelist && Array.isArray(field.component_group_whitelist)) {
        const index = field.component_group_whitelist.indexOf(oldGroupUuid);
        if (index !== -1) {
          field.component_group_whitelist[index] = newGroupUuid;
        }
      }

      // Recursively traverse nested fields
      Object.values(field).forEach((value) => {
        if (Array.isArray(value)) {
          value.forEach((item) => {
            if (typeof item === 'object' && item !== null) {
              traverseField(item);
            }
          });
        }
        else if (typeof value === 'object' && value !== null) {
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
}

class ComponentNode extends GraphNode {
  constructor(id: string, data: SpaceComponent) {
    super(id, 'component', data);
  }

  normalize(): any {
    return normalizeComponentForComparison(this.data as SpaceComponent);
  }

  resolveReferences(targetData: TargetData, graph: DependencyGraph): void {
    const component = this.data as SpaceComponent;

    // Resolve component ID if it exists in target
    const existing = targetData.components.get(component.name);
    if (existing && component.id !== existing.resource.id) {
      component.id = existing.resource.id;
    }

    // Resolve internal tag IDs - map from source space IDs to target space IDs
    if (component.internal_tag_ids && component.internal_tag_ids.length > 0) {
      const resolvedTagIds: string[] = [];

      for (const sourceTagId of component.internal_tag_ids) {
        // Find the tag node in the graph using the node ID format
        const tagNodeId = `tag:${sourceTagId}`;
        const tagNode = graph.nodes.get(tagNodeId);

        if (tagNode) {
          const tagName = tagNode.getName();
          const targetTag = targetData.tags.get(tagName);

          if (targetTag) {
            // Use the target space tag ID
            resolvedTagIds.push(targetTag.resource.id.toString());
          }
          else {
            // Tag will be processed in the same level or was processed in a previous level
            const currentTagData = tagNode.getData<SpaceComponentInternalTag>();
            resolvedTagIds.push(currentTagData.id.toString());
          }
        }
        else {
          // Tag not found in graph, keep original ID
          resolvedTagIds.push(sourceTagId);
        }
      }

      component.internal_tag_ids = resolvedTagIds;
    }

    // Resolve component group UUID if specified
    if (component.component_group_uuid) {
      // Find the group node using the node ID format
      const groupNodeId = `group:${component.component_group_uuid}`;
      const groupNode = graph.nodes.get(groupNodeId);

      if (groupNode) {
        const groupName = groupNode.getName();
        const targetGroup = targetData.groups.get(groupName);

        if (targetGroup) {
          // Use the target space group UUID
          component.component_group_uuid = targetGroup.resource.uuid;
        }
        else {
          // Group will be processed in the same level or was processed in a previous level
          const currentGroupUuid = groupNode.getData<SpaceComponentGroup>().uuid;
          component.component_group_uuid = currentGroupUuid;
        }
      }
    }
  }

  shouldSkip(targetData: TargetData): boolean {
    const existing = targetData.components.get(this.getName());
    if (!existing) { return false; }

    const localHash = generateContentHash(this.normalize());
    return localHash === existing.hash;
  }

  async upsert(
    space: string,
    password: string,
    region: RegionCode,
    targetData: TargetData,
  ): Promise<SpaceComponent> {
    const component = this.data as SpaceComponent;
    const existingId = targetData.components.get(component.name)?.resource.id;
    const result = await upsertComponent(space, component, existingId);

    if (!result) {
      throw new Error(`Failed to upsert component ${component.name}`);
    }

    // Update the node's data with the new server values
    component.id = result.id;
    component.name = result.name;

    return result;
  }

  updateTargetData(result: SpaceComponent, targetData: TargetData): void {
    const normalized = this.normalize();
    const newHash = generateContentHash(normalized);
    targetData.components.set(result.name, { resource: result, hash: newHash });
  }
}

// =============================================================================
// DEPENDENCY EXTRACTION
// =============================================================================

/**
 * Extracts dependency information from a component schema.
 * Traverses the schema to find references to groups, tags, and other components.
 */
export function collectWhitelistDependencies(schema: Record<string, any>): SchemaDependencies {
  const groupUuids = new Set<string>();
  const tagIds = new Set<number>();
  const componentNames = new Set<string>();

  function traverseField(field: Record<string, any>) {
    if (field.type === 'bloks') {
      // Collect group dependencies
      if (field.component_group_whitelist && Array.isArray(field.component_group_whitelist)) {
        field.component_group_whitelist.forEach((uuid: string) => groupUuids.add(uuid));
      }

      // Collect tag dependencies
      if (field.component_tag_whitelist && Array.isArray(field.component_tag_whitelist)) {
        field.component_tag_whitelist.forEach((tagId: number) => tagIds.add(tagId));
      }

      // Collect component dependencies
      if (field.component_whitelist && Array.isArray(field.component_whitelist)) {
        field.component_whitelist.forEach((name: string) => componentNames.add(name));
      }
    }

    // Recursively traverse nested fields
    Object.values(field).forEach((value) => {
      if (Array.isArray(value)) {
        value.forEach((item) => {
          if (typeof item === 'object' && item !== null) {
            traverseField(item);
          }
        });
      }
      else if (typeof value === 'object' && value !== null) {
        traverseField(value);
      }
    });
  }

  // Traverse all fields in the schema
  Object.values(schema).forEach((field) => {
    if (typeof field === 'object' && field !== null) {
      traverseField(field);
    }
  });

  return { groupUuids, tagIds, componentNames };
}

// =============================================================================
// GRAPH BUILDING
// =============================================================================

/**
 * Builds a complete dependency graph from the space data.
 * Each node in the graph represents a resource (component, group, or tag) and
 * maintains bidirectional links to its dependencies and dependents.
 */
export function buildDependencyGraph(spaceData: SpaceData): DependencyGraph {
  const graph: DependencyGraph = { nodes: new Map() };

  // Helper function to establish bidirectional dependencies
  function addDependency(dependentId: string, dependencyId: string) {
    const dependent = graph.nodes.get(dependentId);
    const dependency = graph.nodes.get(dependencyId);

    if (dependent && dependency) {
      dependent.addDependency(dependencyId);
      dependency.addDependent(dependentId);
    }
  }

  // Create nodes for all tags
  spaceData.internalTags.forEach((tag) => {
    const nodeId = `tag:${tag.id}`;
    const node = new TagNode(nodeId, tag);
    graph.nodes.set(nodeId, node);
  });

  // Create nodes for all groups
  spaceData.groups.forEach((group) => {
    const nodeId = `group:${group.uuid}`;
    const node = new GroupNode(nodeId, group);
    graph.nodes.set(nodeId, node);
  });

  // Create nodes for all components
  spaceData.components.forEach((component) => {
    const nodeId = `component:${component.name}`;
    const node = new ComponentNode(nodeId, component);
    graph.nodes.set(nodeId, node);
  });

  // Add group parent dependencies
  spaceData.groups.forEach((group) => {
    if (group.parent_uuid) {
      const childId = `group:${group.uuid}`;
      const parentId = `group:${group.parent_uuid}`;
      addDependency(childId, parentId);
    }
  });

  // Add component dependencies based on schema analysis
  spaceData.components.forEach((component) => {
    const componentId = `component:${component.name}`;

    // Add dependencies on internal_tag_ids (direct component tag references)
    if (component.internal_tag_ids && component.internal_tag_ids.length > 0) {
      component.internal_tag_ids.forEach((tagId) => {
        const tagNodeId = `tag:${tagId}`;
        addDependency(componentId, tagNodeId);
      });
    }

    // Add dependencies on component_group_uuid (component group assignment)
    if (component.component_group_uuid) {
      const groupId = `group:${component.component_group_uuid}`;
      addDependency(componentId, groupId);
    }

    if (component.schema) {
      const dependencies = collectWhitelistDependencies(component.schema);

      // Add dependencies on groups (from schema whitelists)
      dependencies.groupUuids.forEach((groupUuid) => {
        const groupId = `group:${groupUuid}`;
        addDependency(componentId, groupId);
      });

      // Add dependencies on tags (from schema whitelists)
      dependencies.tagIds.forEach((tagId) => {
        const tagNodeId = `tag:${tagId}`;
        addDependency(componentId, tagNodeId);
      });

      // Add dependencies on other components
      dependencies.componentNames.forEach((componentName) => {
        const dependencyId = `component:${componentName}`;
        addDependency(componentId, dependencyId);
      });
    }
  });

  return graph;
}

// =============================================================================
// GRAPH VALIDATION
// =============================================================================

/**
 * Detects problematic cycles in the dependency graph.
 * Returns an array of cycle descriptions that would prevent successful processing.
 */
export function detectProblematicCycles(graph: DependencyGraph): string[] {
  const problematicCycles: string[] = [];
  const visited = new Set<string>();
  const recursionStack = new Set<string>();

  function dfs(nodeId: string, path: string[]): boolean {
    if (recursionStack.has(nodeId)) {
      // Found a cycle - check if it's problematic
      const cycleStart = path.indexOf(nodeId);
      const cycle = path.slice(cycleStart).concat(nodeId);

      // Cycles involving groups or tags are always problematic
      const hasGroupOrTag = cycle.some(id => id.startsWith('group:') || id.startsWith('tag:'));
      if (hasGroupOrTag) {
        problematicCycles.push(`Problematic cycle: ${cycle.join(' → ')}`);
      }

      return true;
    }

    if (visited.has(nodeId)) {
      return false;
    }

    visited.add(nodeId);
    recursionStack.add(nodeId);
    path.push(nodeId);

    const node = graph.nodes.get(nodeId);
    if (node) {
      for (const dependencyId of node.dependencies) {
        if (dfs(dependencyId, path)) {
          // Continue to find all cycles, don't return early
        }
      }
    }

    recursionStack.delete(nodeId);
    path.pop();
    return false;
  }

  // Check all nodes for cycles
  for (const nodeId of graph.nodes.keys()) {
    if (!visited.has(nodeId)) {
      dfs(nodeId, []);
    }
  }

  return problematicCycles;
}

/**
 * Detects circular component whitelists (informational, not problematic).
 * Returns an array of component names that have circular references.
 */
export function detectCircularWhitelists(graph: DependencyGraph): string[] {
  const circularComponents: string[] = [];
  const visited = new Set<string>();
  const recursionStack = new Set<string>();

  function dfs(nodeId: string, path: string[]): boolean {
    if (recursionStack.has(nodeId)) {
      // Found a cycle - check if it's component-only
      const cycleStart = path.indexOf(nodeId);
      const cycle = path.slice(cycleStart);

      // Only report if cycle contains only components
      const isComponentOnlyCycle = cycle.every(id => id.startsWith('component:'));
      if (isComponentOnlyCycle) {
        const componentNames = cycle.map(id => id.replace('component:', ''));
        circularComponents.push(...componentNames);
      }

      return true;
    }

    if (visited.has(nodeId)) {
      return false;
    }

    // Only traverse component nodes for this check
    if (!nodeId.startsWith('component:')) {
      return false;
    }

    visited.add(nodeId);
    recursionStack.add(nodeId);
    path.push(nodeId);

    const node = graph.nodes.get(nodeId);
    if (node) {
      for (const dependencyId of node.dependencies) {
        if (dependencyId.startsWith('component:')) {
          dfs(dependencyId, path);
        }
      }
    }

    recursionStack.delete(nodeId);
    path.pop();
    return false;
  }

  // Check all component nodes
  for (const nodeId of graph.nodes.keys()) {
    if (nodeId.startsWith('component:') && !visited.has(nodeId)) {
      dfs(nodeId, []);
    }
  }

  return [...new Set(circularComponents)]; // Remove duplicates
}

// =============================================================================
// PROCESSING ORDER
// =============================================================================

/**
 * Determines the optimal processing order using topological sorting.
 * Returns an array of levels, where each level contains nodes that can be processed in parallel.
 */
export function determineProcessingOrder(graph: DependencyGraph): string[][] {
  const inDegree = new Map<string, number>();
  const levels: string[][] = [];

  // Calculate in-degrees for all nodes
  for (const [nodeId, node] of graph.nodes) {
    inDegree.set(nodeId, node.dependencies.size);
  }

  // Process nodes level by level
  while (inDegree.size > 0) {
    // Find all nodes with no remaining dependencies
    const currentLevel: string[] = [];
    for (const [nodeId, degree] of inDegree) {
      if (degree === 0) {
        currentLevel.push(nodeId);
      }
    }

    if (currentLevel.length === 0) {
      // If no nodes can be processed, we have unresolvable cycles
      const remaining = Array.from(inDegree.keys());
      throw new Error(`Unresolvable dependencies detected: ${remaining.join(', ')}`);
    }

    levels.push(currentLevel);

    // Remove processed nodes and update in-degrees
    for (const nodeId of currentLevel) {
      inDegree.delete(nodeId);
      const node = graph.nodes.get(nodeId)!;

      // Decrease in-degree for all dependents
      for (const dependentId of node.dependents) {
        const currentDegree = inDegree.get(dependentId);
        if (currentDegree !== undefined) {
          inDegree.set(dependentId, currentDegree - 1);
        }
      }
    }
  }

  return levels;
}

// =============================================================================
// GRAPH VALIDATION
// =============================================================================

/**
 * Validates the dependency graph and throws errors for critical issues.
 */
export function validateGraph(graph: DependencyGraph): void {
  console.log(`📊 Built dependency graph with ${graph.nodes.size} nodes`);

  // Check for problematic cycles
  const problematicCycles = detectProblematicCycles(graph);
  if (problematicCycles.length > 0) {
    throw new Error(`❌ Problematic cycles detected:\n${problematicCycles.join('\n')}`);
  }

  // Report circular whitelists (informational)
  const circularWhitelists = detectCircularWhitelists(graph);
  if (circularWhitelists.length > 0) {
    console.log(`ℹ️  Circular component whitelists detected (allowed): ${circularWhitelists.join(', ')}`);
  }

  console.log(`✅ Graph validation passed`);
}
