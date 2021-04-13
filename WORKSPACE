workspace(
    name = "myspace",
    managed_directories = {"@npm": ["node_modules"]},
)

load("@bazel_tools//tools/build_defs/repo:http.bzl", "http_archive")

http_archive(
    name = "build_bazel_rules_nodejs",
    sha256 = "f533eeefc8fe1ddfe93652ec50f82373d0c431f7faabd5e6323f6903195ef227",
    urls = ["https://github.com/bazelbuild/rules_nodejs/releases/download/3.3.0/rules_nodejs-3.3.0.tar.gz"],
)

load("@build_bazel_rules_nodejs//:index.bzl", "node_repositories", "npm_install")

node_repositories(
    node_version = "14.16.0",
    package_json = ["//:package.json"],
)

npm_install(
    name = "npm",
    data = [
        "//:patches/jest-haste-map+26.6.2.patch",
    ],
    package_json = "//:package.json",
    package_lock_json = "//:package-lock.json",
)
