import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import alias from '@rollup/plugin-alias';
import path from 'path';

// Look up the project root directory which is equivalent to the one WORKSPACE is located.
const projectRoot = path.resolve(__dirname).replace(/^(.+\/bazel-out\/[^/]+\/bin).*$/, '$1');

export default {
  input: "src/index.js",
  output: {
    file: "bundle.js",
    format: "cjs",
    sourcemap: true,
  },
  plugins: [
    commonjs(),
    alias({
      entries: [
        { find: /^myspace\/(.+)$/, replacement: `${projectRoot}/$1` },
      ],
    }),
    resolve(),
  ],
};
