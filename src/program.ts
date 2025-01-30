// program.ts
import { Command } from 'commander';
import * as fs from 'node:fs';
import { resolve } from 'pathe';
import { __dirname, handleError } from './utils';

// Read package.json for metadata
const packageJsonPath = resolve(__dirname, process.env.VITEST || process.env.STUB ? '../../package.json' : '../package.json');
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));

// Declare a variable to hold the singleton instance
let programInstance: Command | null = null;

// Singleton function to get the instance of program
/**
 * Get the shared program singleton instance
 *
 * @export getProgram
 * @return {*}  {Command}
 */
export function getProgram(): Command {
  if (!programInstance) {
    programInstance = new Command();
    programInstance
      .name(packageJson.name)
      .description(packageJson.description)
      .version(packageJson.version);

    // Global error handling
    programInstance.configureOutput({
      writeErr: str => handleError(new Error(str)),
    });
  }
  return programInstance;
}
