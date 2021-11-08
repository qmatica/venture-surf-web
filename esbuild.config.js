import esbuild from 'esbuild'
import babel from 'esbuild-plugin-babel'

esbuild
  .build({
    entryPoints: ['sw.ts'],
    outdir: 'public',
    bundle: true,
    sourcemap: true,
    minify: true,
    format: 'esm',
    legalComments: 'external',
    plugins: [babel()],
    target: ['es5']
  })
  .catch(() => process.exit(1))
