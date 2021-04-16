import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import alias from '@rollup/plugin-alias';
import replace from '@rollup/plugin-replace';
import path from 'path';

// Look up the project root directory which is equivalent to the one WORKSPACE is located.
const projectRoot = path.resolve(__dirname).replace(/^(.+\/bazel-out\/[^/]+\/bin).*$/, '$1');

// TODO: support production and development build: https://bazelbuild.github.io/rules_nodejs/Rollup.html#debug-and-opt-builds
// TODO: generate chunks properly
// TODO: generate hashed bundle directory name and inject it to index.html

export default {
  input: "src/index.js",
  output: {
    dir: "bundle",
    format: "iife",
    sourcemap: true,
    name: 'myspace',
  },
  plugins: [
    commonjs(),
    alias({
      entries: [
        { find: /^myspace\/(.+)$/, replacement: `${projectRoot}/$1` },
      ],
    }),
    resolve(),
    replace({
      values: {
        'process.env.NODE_ENV': JSON.stringify('production'), // TODO: remove this and use pkg_web substitutions
      },
      preventAssignment: true,
    }),
  ],
};
