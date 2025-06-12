import type { RegionCode } from '../../../../constants';
import type { SpaceData } from '../../constants';
import type { PushResults, TargetData } from './types';

import { buildDependencyGraph, validateGraph } from './dependency-graph';
import { processAllResources } from './resource-processor';

// Re-export commonly used utilities
export { buildTargetDataFromMaps } from './comparison-utils';
export type { PushResults, TargetData } from './types';

// =============================================================================
// MAIN COORDINATOR
// =============================================================================

/**
 * Main function to push components using graph-based dependency resolution.
 *
 * Architecture:
 * - Build dependency graph with topological ordering
 * - For each level: resolve references then process resources
 *
 * Benefits:
 * - Deterministic processing order
 * - References resolved when dependencies exist
 * - Clean behavioral node abstraction
 * - Robust error handling and progress tracking
 */
export async function pushWithDependencyGraph(
  space: string,
  password: string,
  region: RegionCode,
  spaceData: SpaceData,
  targetData: TargetData,
  maxConcurrency: number = 5,
): Promise<PushResults> {
  // Build and validate the dependency graph
  const graph = buildDependencyGraph(spaceData);
  validateGraph(graph);

  // Process resources with 2-pass per level approach:
  // - Pass 1: Resolve references (dependencies from previous levels exist)
  // - Pass 2: Process resources with resolved references
  const results = await processAllResources(graph, space, password, region, targetData, maxConcurrency);

  // TODO: Process presets after main resources
  // const presetResults = await processPresets(spaceData.presets, graph, targetData, space, password, region);
  // results.successful.push(...presetResults.successful);
  // results.failed.push(...presetResults.failed);
  // results.skipped.push(...presetResults.skipped);

  return results;
}
