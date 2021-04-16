workspace(
    name = "myspace",
    managed_directories = {"@npm": ["node_modules"]},
)

load("@bazel_tools//tools/build_defs/repo:http.bzl", "http_archive")

http_archive(
    name = "build_bazel_rules_nodejs",
    sha256 = "1134ec9b7baee008f1d54f0483049a97e53a57cd3913ec9d6db625549c98395a",
    urls = ["https://github.com/bazelbuild/rules_nodejs/releases/download/3.4.0/rules_nodejs-3.4.0.tar.gz"],
)

load("@build_bazel_rules_nodejs//:index.bzl", "node_repositories", "npm_install")

# TODO: terser_minified doesn't currently work with this configuration. https://github.com/bazelbuild/rules_nodejs/issues/2610
# node_repositories(
#     node_version = "14.16.0",
#     package_json = ["//:package.json"],
# )

npm_install(
    name = "npm",
    data = [
        "//:patches/jest-haste-map+26.6.2.patch",
    ],
    package_json = "//:package.json",
    package_lock_json = "//:package-lock.json",
)
