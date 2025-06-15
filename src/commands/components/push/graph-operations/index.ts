import type { RegionCode } from '../../../../constants';
import type { SpaceDataState } from '../../constants';
import type { GraphBuildingContext, PushResults } from './types';

import { buildDependencyGraph, validateGraph } from './dependency-graph';
import { processAllResources } from './resource-processor';

// Re-export commonly used utilities
export type { PushResults } from './types';

// =============================================================================
// MAIN COORDINATOR
// =============================================================================

/**
 * Main function to push components using graph-based dependency resolution.
 *
 * Architecture:
 * - Build dependency graph with colocated target data
 * - For each level: resolve references then process resources
 * - Target data is embedded in each graph node for efficient upserts
 *
 * Benefits:
 * - Deterministic processing order
 * - References resolved when dependencies exist
 * - Clean behavioral node abstraction with colocated data
 * - Robust error handling and progress tracking
 */
export async function pushWithDependencyGraph(
  space: string,
  spaceState: SpaceDataState,
  maxConcurrency: number = 5,
  force: boolean = false,
): Promise<PushResults> {
  // Build and validate the dependency graph with colocated target data
  const context: GraphBuildingContext = { spaceState };
  const graph = buildDependencyGraph(context);
  validateGraph(graph);

  // Process resources with 2-pass per level approach:
  // - Pass 1: Resolve references (dependencies from previous levels exist)
  // - Pass 2: Process resources with resolved references
  const results = await processAllResources(graph, space, maxConcurrency, force);

  // TODO: Process presets after main resources
  // const presetResults = await processPresets(spaceData.presets, graph, space, password, region);
  // results.successful.push(...presetResults.successful);
  // results.failed.push(...presetResults.failed);
  // results.skipped.push(...presetResults.skipped);

  return results;
}
