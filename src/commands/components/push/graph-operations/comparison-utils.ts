import { createHash } from 'node:crypto';
import type {
  SpaceComponent,
  SpaceComponentGroup,
  SpaceComponentInternalTag,
  SpaceComponentPreset,
} from '../../constants';
import type { TargetData } from './types';

// =============================================================================
// NORMALIZATION FUNCTIONS
// =============================================================================

/**
 * Normalizes resources for content comparison by removing fields that should differ
 * between local and target (like IDs, timestamps, etc.)
 */
export function normalizeComponentForComparison(component: SpaceComponent): any {
  // Only include fields that are meaningful for content comparison
  // and exclude space-specific identifiers and auto-generated fields
  const comp = component as any; // Cast to any to access all possible fields

  const meaningfulFields: any = {
    name: comp.name,
    display_name: comp.display_name,
    description: comp.description || '',
    image: comp.image || '',
    preview_field: comp.preview_field,
    is_root: comp.is_root,
    preview_tmpl: comp.preview_tmpl,
    is_nestable: comp.is_nestable,
    real_name: comp.real_name,
    color: comp.color || '',
    icon: comp.icon || '',
    content_type_asset_preview: comp.content_type_asset_preview,
    metadata: comp.metadata || {},
  };

  // Normalize schema by removing space-specific references
  if (comp.schema) {
    meaningfulFields.schema = normalizeSchemaForComparison(comp.schema);
  }

  return meaningfulFields;
}

/**
 * Normalizes schema by removing or canonicalizing space-specific references
 */
export function normalizeSchemaForComparison(schema: Record<string, any>): Record<string, any> {
  if (!schema || typeof schema !== 'object') {
    return schema;
  }

  const normalizedSchema = JSON.parse(JSON.stringify(schema)); // Deep copy

  function normalizeField(field: any): any {
    if (typeof field !== 'object' || field === null) {
      return field;
    }

    if (Array.isArray(field)) {
      return field.map(normalizeField);
    }

    const normalizedField = { ...field };

    // Remove space-specific whitelist references
    if (normalizedField.type === 'bloks') {
      delete normalizedField.component_tag_whitelist;
      delete normalizedField.component_group_whitelist;
      delete normalizedField.component_whitelist;
    }

    // Remove space-specific field IDs
    delete normalizedField.id;

    // Recursively normalize nested fields
    Object.keys(normalizedField).forEach((key) => {
      if (typeof normalizedField[key] === 'object' && normalizedField[key] !== null) {
        normalizedField[key] = normalizeField(normalizedField[key]);
      }
    });

    return normalizedField;
  }

  const result: Record<string, any> = {};
  Object.keys(normalizedSchema).forEach((key) => {
    result[key] = normalizeField(normalizedSchema[key]);
  });

  return result;
}

export function normalizeGroupForComparison(group: SpaceComponentGroup): Partial<SpaceComponentGroup> {
  const { id, uuid, parent_id, parent_uuid, ...normalized } = group;
  return normalized;
}

export function normalizeTagForComparison(tag: SpaceComponentInternalTag): Partial<SpaceComponentInternalTag> {
  const { id, ...normalized } = tag;
  return normalized;
}

export function normalizePresetForComparison(preset: SpaceComponentPreset): Partial<SpaceComponentPreset> {
  const { id, created_at, updated_at, space_id, component_id, ...normalized } = preset;
  return normalized;
}

// =============================================================================
// HASHING FUNCTIONS
// =============================================================================

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
export function generateContentHash(obj: any): string {
  const normalized = normalizeForHashing(obj);
  return createHash('sha256').update(JSON.stringify(normalized)).digest('hex');
}

// =============================================================================
// TARGET DATA UTILITIES
// =============================================================================

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

  // Build components with content hashes
  components.forEach((component, name) => {
    const normalized = normalizeComponentForComparison(component);
    const hash = generateContentHash(normalized);
    targetData.components.set(name, { resource: component, hash });
  });

  // Build groups with content hashes
  groups.forEach((group, name) => {
    const normalized = normalizeGroupForComparison(group);
    const hash = generateContentHash(normalized);
    targetData.groups.set(name, { resource: group, hash });
  });

  // Build tags with content hashes
  tags.forEach((tag, name) => {
    const normalized = normalizeTagForComparison(tag);
    const hash = generateContentHash(normalized);
    targetData.tags.set(name, { resource: tag, hash });
  });

  // Build presets with content hashes
  presets.forEach((preset, name) => {
    const normalized = normalizePresetForComparison(preset);
    const hash = generateContentHash(normalized);
    targetData.presets.set(name, { resource: preset, hash });
  });

  return targetData;
}
