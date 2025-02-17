import { resolvePath, saveToFile } from '../../../utils/filesystem';
import type { SpaceComponent } from '../../../commands/components';
import { join, resolve } from 'node:path';
import { handleFileSystemError } from '../../../utils';

const getMigrationTemplate = (fieldName: string) => {
  return `export default function (block) {
  // Example to change a string to boolean
  // block.${fieldName} = !!(block.${fieldName})

  // Example to transfer content from other field
  // block.${fieldName} = block.other_field
}
`;
};

export const generateMigration = async (space: string, path: string | undefined, component: SpaceComponent, field: string, suffix?: string) => {
  const resolvedPath = path
    ? resolve(process.cwd(), path, 'migrations', space)
    : resolvePath(path, `migrations/${space}`);

  const fileName = suffix ? `${component.name}-${field}.${suffix}.js` : `${component.name}-${field}.js`;
  const migrationPath = join(resolvedPath, fileName);

  try {
    await saveToFile(migrationPath, getMigrationTemplate(field));
  }
  catch (error) {
    handleFileSystemError('write', error as Error);
  }
};
