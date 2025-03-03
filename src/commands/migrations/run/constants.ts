import type { CommandOptions } from '../../../types';

export interface MigrationsRunOptions extends CommandOptions {
  dryRun?: boolean;
  filter?: string;
}

export interface ReadMigrationFilesOptions {
  space: string;
  path: string;
  filter?: string;
}

export interface MigrationFile {
  name: string;
  content: string;
}
