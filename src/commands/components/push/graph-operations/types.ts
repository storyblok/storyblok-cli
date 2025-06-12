import type { RegionCode } from '../../../../constants';
import type {
  SpaceComponent,
  SpaceComponentGroup,
  SpaceComponentInternalTag,
  SpaceComponentPreset,
} from '../../constants';

// =============================================================================
// CORE TYPES
// =============================================================================

/** Types of nodes in our dependency graph */
export type NodeType = 'component' | 'group' | 'tag';

/** Data that can be stored in a graph node */
export type NodeData = SpaceComponent | SpaceComponentGroup | SpaceComponentInternalTag;

/** Target data with content hashes for efficient comparison */
export interface TargetData {
  components: Map<string, { resource: SpaceComponent; hash: string }>;
  groups: Map<string, { resource: SpaceComponentGroup; hash: string }>;
  tags: Map<string, { resource: SpaceComponentInternalTag; hash: string }>;
  presets: Map<string, { resource: SpaceComponentPreset; hash: string }>;
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
// GRAPH TYPES
// =============================================================================

/** Abstract base class for all graph nodes */
export abstract class GraphNode {
  public processed: boolean = false;

  constructor(
    public readonly id: string,
    public readonly type: NodeType,
    protected data: NodeData,
    public readonly dependencies: Set<string> = new Set(),
    public readonly dependents: Set<string> = new Set(),
  ) {}

  // Graph structure methods
  addDependency(dependencyId: string): void {
    this.dependencies.add(dependencyId);
  }

  addDependent(dependentId: string): void {
    this.dependents.add(dependentId);
  }

  getName(): string {
    return (this.data as any).name;
  }

  getData<T extends NodeData>(): T {
    return this.data as T;
  }

  // 2-Pass processing interface
  abstract resolveReferences(targetData: TargetData, graph: DependencyGraph): void;
  abstract shouldSkip(targetData: TargetData): boolean;
  abstract upsert(space: string, password: string, region: RegionCode, targetData: TargetData): Promise<any>;
  abstract updateTargetData(result: any, targetData: TargetData): void;
  abstract normalize(): any;
}

/** The complete dependency graph */
export interface DependencyGraph {
  nodes: Map<string, GraphNode>;
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
}
