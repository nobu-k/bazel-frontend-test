# About this repository

This repository tries to use Bazel to build React/TypeScript apps with Bazel.

# TODO

* coverage
* Next.js

# Note

This section contains notes about issues with which I struggled a lot.

## Import paths and `tsconfig.json`

It seems a good practice to use the workspace name defined in `WORKSPACE` as the prefix of all import paths. It's `myspace` in this repository.

To enable TS Language Server with VSCode, `paths` in `tsconfig.json` should look something like

```
   "paths": {
      "myspace/*": [
        "*",
        "./bazel-out/host/bin/*",
        "./bazel-out/darwin-fastbuild/bin/*",
        "./bazel-out/k8-fastbuild/bin/*",
        "./bazel-out/x64_windows-fastbuild/bin/*",
        "./bazel-out/darwin-dbg/bin/*",
        "./bazel-out/k8-dbg/bin/*",
        "./bazel-out/x64_windows-dbg/bin/*"
      ]
    }
```

Also, `bazel-*` needs to be excluded in `tsconfig.json` somehow (TODO: why?).

### Unresolved issue

I haven't encountered an issue described in https://github.com/bazelbuild/rules_nodejs/issues/2298, so I don't understand what it is and why `rootDirs` also needs to be configured as described in the official document. I'll update it once I experience the issue.

## Create a TypeScript library with `ts_project`

The official document says that `ts_library` will be deprecated and every new project should use `ts_project` instead.

One of the differences between `ts_library` and `ts_project` is that the `name` attribute of `ts_project` is used to look up a `tsconfig.json` file as `<name>.json`. Because of this behavior, the default value of `name` is `tsconfig` and it looks for `tsconfig.json` in the same directory. Use `tsconfig` attribute if we don't want to provide `<name>.json` or use the shared `tsconfig.json`.

The next pitfall is that configurations provided by `tsconfig.json` and attributes of `ts_project` must match. For example, to produce type definition files, `declaration` in `tsconfig.json` needs to be true. At the same time, `ts_project` also needs to have `declaration = True` to match the corresponding `tsconfig.json`. This validation can be disabled by passing `validate = False` to `ts_project`. However, it sounds like a better idea to enable the validation to detect unintended configuration. (See: https://github.com/bazelbuild/rules_nodejs/issues/2575)

## jest

To test TypeScript files with Jest, use `ts_project` and `jest_test` together.

`jest_test` needs some configurations in advance.

First of all, `jest.config.json` has to be provided. In this repository, it's located at the root, but it can be customized with `--config` flag passed to `jest_test`'s `args`. `testMatch` only needs to match `*.js` files because `ts_project` converts `*.ts` files to `*.js` before tests run. Also, `moduleNameMapper` has to replace the prefix (`myspace` in this repository) to `<rootDir>`.

Second of all, `jest-haste-map` has to be patched to workaround an issue described at https://github.com/facebook/jest/issues/9350. Basically, it doesn't follow symbolic links and `-type f` parameter has to be changed. To apply patch, I used the same approach demonstrated in [the official `jest` example](https://github.com/bazelbuild/rules_nodejs/tree/stable/examples/jest) with [`patch-package`](https://www.npmjs.com/package/patch-package). The patch file has to be added to `npm_install`'s `data` attribute in `WORKSPACE`.

Finally, to apply patches during the `postinstall` phase, `package.json` has to have `name` (see: https://github.com/npm/cli/issues/1299). This issue will be fixed in npm v7.

## `fsevents` and `npm_install`

Bazel doesn't recognize optional dependencies via `npm_install`. So, when `fsevents` is installed on Linux, it fails. This failure doesn't occur with `yarn`. So, use `yarn` instead of `npm` once this error happens.

## Rollup

When configuring `tsconfig.json` to generate commonjs output, Rollup requires `@rollup/plugin-commonjs` (see: https://github.com/rollup/rollup/issues/3355).

To resolve internal libraries, path aliases (`myspace/` in this case) must be resolved manually. `PWD` in the build process is at `/path/to/execroot/myspace`. Then, all outputs are placed under `/path/to/execroot/myspace/bazel-out/k8-fastbuild/bin`. The actual value of `k8-fastbuild/bin` depends on the environment where `bazel build` is executed. So, `myspace/path/to/lib` needs to be replaced with `/path/to/execroot/myspace/bazel-out/k8-fastbuild/bin/path/to/lib`.

To output a bundled file that can be used by browser, `format` should be `iife`. The format value has to be provided to both `rollup_bundle` (and `rollup.config.js`, just in case, although it isn't used).

Some parameters available in config files will not be used because `rollup_bundle` overwrites them with command line flags. This includes`format` and `output.dir`. Because of this specification, the name of `output.dir` is not customizable at the time of this writing. You can look at `rollup_bundle.bzl` to see which parameters will be overwritten.

React uses `process.env` internally, and it has to be replaced.

## `pkg_web`'s `substitutions`

I wanted to use `substitutions` attributes to replace `process.env.NODE_ENV` in the bundled code. However, it didn't work well. It's probably because the `genrule` only specifies the directory as its output and `pkg_web` doesn't crawl inside, but I'm not sure because `rules_nodejs/internal/pkg_web/assembler.js` seems to be doing its job.

## Test coverage

Currently, I couldn't figure out how to make Bazel merge reports generated by Jest. It's not perfect but running test (e.g. `bazel run //add:test`) prints coverage information to stdout.

# References

* [`rules_nodejs`](https://bazelbuild.github.io/rules_nodejs/)
* [`jest` example](https://github.com/bazelbuild/rules_nodejs/tree/stable/examples/jest)
* [`dataform`](https://github.com/dataform-co/dataform)
    * It's a great example of how to manage monorepo with Bazel and how to publish packages.
    * Published packages are basically managed under the packages directory, and each package have a thin wrapper to "link" with internal libraries.
