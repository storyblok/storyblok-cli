import { defineConfig } from 'tsdown';

export default defineConfig({
  // Entry point - same as current unbuild config
  entry: './src/index.ts',

  // Output format - ESM for modern Node.js CLI
  format: ['esm'],

  // Generate TypeScript declarations
  dts: true,

  // Enable source maps
  sourcemap: true,

  // Output directory (defaults to dist)
  outDir: 'dist',

  // Clean output directory before build
  clean: true,

  // Target Node.js environment
  platform: 'node',

  // Preserve shebang for CLI tools
  shims: true,

  // Enable tree-shaking for smaller bundle
  treeshake: true,

  // Don't bundle Node.js built-ins and dependencies
  external: [
    // Node.js built-ins are automatically external
    // Keep dependencies external for CLI tools
    /^@inquirer/,
    /^@storyblok/,
    /^@topcli/,
    'chalk',
    'commander',
    'dotenv',
    'json-schema-to-typescript',
    'ohash',
    'pathe',
    'read-package-up',
    'storyblok-js-client',
  ],

  // Minify for production
  minify: false, // Keep readable for CLI debugging
});
