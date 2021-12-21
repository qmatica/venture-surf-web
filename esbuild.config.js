import esbuild from 'esbuild'
import babel from 'esbuild-plugin-babel'
import envFilePlugin from 'esbuild-envfile-plugin'

esbuild
  .build({
    entryPoints: ['sw.ts'],
    outdir: 'public',
    bundle: true,
    sourcemap: true,
    minify: true,
    format: 'esm',
    legalComments: 'external',
    plugins: [envFilePlugin, babel()],
    target: ['es6']
  })
  .catch(() => process.exit(1))
