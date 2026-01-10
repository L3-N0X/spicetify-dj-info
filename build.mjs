import * as esbuild from 'esbuild';
import { readFile, writeFile } from 'fs/promises';
import { minify } from 'terser';

const pkg = JSON.parse(await readFile('package.json', 'utf-8'));
const isWatch = process.argv.includes('--watch');

const BANNER = `// @ts-nocheck
// NAME: DJ Info
// AUTHOR: L3N0X
// VERSION: ${pkg.version}
// DESCRIPTION: BPM and Energy display for each song
// ===================================================

/// <reference path="../globals.d.ts" />
`;

const outFile = 'dist/djinfo.mjs';

const buildOptions = {
  entryPoints: ['src/main.mjs'],
  bundle: true,
  outfile: outFile,
  format: 'iife',
  globalName: 'DJInfo',
  platform: 'browser',
  target: 'es2017',
  minify: false,
  sourcemap: isWatch ? 'inline' : false,
  define: {
    'process.env.NODE_ENV': isWatch ? '"development"' : '"production"',
  },
  banner: {
    js: BANNER,
  },
};

const runTerser = async () => {
  console.log('Minifying with Terser...');
  try {
    const code = await readFile(outFile, 'utf-8');
    const minified = await minify(code, {
      compress: {
        passes: 3,
        drop_console: false,
      },
      mangle: {
        toplevel: true,
      },
      format: {
        comments: /NAME:|AUTHOR:|VERSION:|DESCRIPTION:|====/,
        beautify: false,
      },
    });
    if (minified.code) {
      await writeFile(outFile, minified.code);
      console.log('Terser optimization complete.');
    }
  } catch (err) {
    console.error('Terser error:', err);
  }
};

async function build() {
  try {
    if (isWatch) {
      const ctx = await esbuild.context(buildOptions);
      await ctx.watch();
      console.log('Watching for changes...');
    } else {
      await esbuild.build(buildOptions);
      console.log('Build complete: djinfo.mjs');
      await runTerser();
    }
  } catch (error) {
    console.error('Build failed:', error);
    process.exit(1);
  }
}

build();
