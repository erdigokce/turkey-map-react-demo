import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const rootDir = path.dirname(fileURLToPath(import.meta.url));
const linkedPackageJson = path.resolve(rootDir, 'node_modules/turkey-map-react/package.json');
const linkedGeoJsonPath = path.resolve(rootDir, 'node_modules/turkey-map-react/lib/geojson.js');
const linkedPackage = fs.existsSync(linkedPackageJson)
  ? JSON.parse(fs.readFileSync(linkedPackageJson, 'utf8'))
  : undefined;
const needsGeoJsonFallback = Boolean(
  linkedPackage
  && !linkedPackage.exports?.['./geojson']
  && fs.existsSync(linkedGeoJsonPath),
);

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/setupTests.js',
    // The linked package's webpack CJS bundle does not mark itself as
    // __esModule, so Vitest's default import interop returns the whole module.
    // These shims keep the default component import working in tests.
    alias: [
      {
        find: /^turkey-map-react$/,
        replacement: path.resolve(rootDir, 'src/test-utils/turkeyMapDefault.js'),
      },
      {
        find: /^turkey-map-react\/core$/,
        replacement: path.resolve(rootDir, 'src/test-utils/turkeyMapCoreDefault.js'),
      },
    ],
  },
  resolve: {
    dedupe: ['react', 'react-dom'],
    // The linked library keeps its own node_modules. Resolve React from the
    // demo so hooks and the renderer always share one React instance.
    alias: {
      react: path.resolve(rootDir, 'node_modules/react'),
      'react-dom': path.resolve(rootDir, 'node_modules/react-dom'),
      // Temporary fallback while the sibling checkout is mid-rebase and its
      // package.json does not yet export the finished ./geojson subpath.
      ...(needsGeoJsonFallback
        ? { 'turkey-map-react/geojson': linkedGeoJsonPath }
        : {}),
    },
  },
  optimizeDeps: {
    // The library is linked via `file:`, so Vite treats it as source and does
    // not pre-bundle it by default. Include every CJS entry point used by the
    // demo so named imports such as `import { cities } from '.../data'` work.
    include: ['turkey-map-react', 'turkey-map-react/data', 'turkey-map-react/core', 'turkey-map-react/geojson'],
  },
  build: {
    commonjsOptions: {
      include: [/turkey-map-react/, /node_modules/],
    },
  },
});
