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

export const generateMigration = async (space: string, path: string, component: SpaceComponent, field: string) => {
  const resolvedPath = path
    ? resolve(process.cwd(), path, 'migrations', space)
    : resolvePath(path, `migrations/${space}`);

  const migrationPath = join(resolvedPath, `${component.name}-${field}.js`);

  try {
    await saveToFile(migrationPath, getMigrationTemplate(field));
  }
  catch (error) {
    handleFileSystemError('write', error as Error);
  }
};
