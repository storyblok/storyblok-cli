import type { RegionCode } from '../../../../constants';
import type {
  SpaceComponent,
  SpaceComponentGroup,
  SpaceComponentInternalTag,
  SpaceDataState,
} from '../../constants';

// =============================================================================
// CORE TYPES
// =============================================================================

/** Types of nodes in our dependency graph */
export type NodeType = 'component' | 'group' | 'tag';

/** Data that can be stored in a graph node */
export type NodeData = SpaceComponent | SpaceComponentGroup | SpaceComponentInternalTag;

/** Target resource information colocated with graph nodes */
export interface TargetResourceInfo<T extends NodeData> {
  resource: T;
  id: string | number;
  hash: string;
}

/** A unified node that tracks both source and target resources */
export interface UnifiedNode<T extends NodeData> {
  id: string;
  name: string;
  type: NodeType;
  sourceData: T;
  targetData?: TargetResourceInfo<T>;
  dependencies: Set<string>;
  dependents: Set<string>;

  // Methods that each node must implement
  getName: () => string;
  normalize: () => any;
  shouldSkip: () => boolean;
  resolveReferences: (graph: DependencyGraph) => void;
  upsert: (space: string) => Promise<T>;
  updateTargetData: (result: T) => void;
}

/** The complete dependency graph using unified nodes */
export interface DependencyGraph {
  nodes: Map<string, UnifiedNode<any>>;
}

/** Results from the push operation */
export interface PushResults {
  successful: string[];
  failed: Array<{ name: string; error: unknown }>;
  skipped: string[];
}

/** Dependencies extracted from component schemas */
export interface SchemaDependencies {
  groupUuids: Set<string>;
  tagIds: Set<number>;
  componentNames: Set<string>;
}

// =============================================================================
// PROCESSING TYPES
// =============================================================================

/** Result from processing a single node */
export interface NodeProcessingResult {
  name: string;
  skipped: boolean;
  error?: any;
}

/** Configuration for the push operation */
export interface PushConfig {
  space: string;
  password: string;
  region: RegionCode;
  maxConcurrency: number;
  force: boolean;
}

/** Graph building context with source and target data */
export interface GraphBuildingContext {
  spaceState: SpaceDataState;
}
