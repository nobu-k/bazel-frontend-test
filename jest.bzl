"Small utility to provide typical parameters to jest_test"

load("@npm//jest-cli:index.bzl", "jest", _jest_test = "jest_test")

# TODO: write documents

def jest_test(name, target, deps = [], jest_config = None, **kwargs):
    templated_args = [
        "--no-cache",
        "--no-watchman",
        "--ci",
        "--colors",
    ]
    if jest_config == None:
        jest_config = "//:jest.config.js"
    else:
        templated_args.extend(["--config", "$(rootpath %s)" % jest_config])

    data = [target, jest_config] + deps
    _jest_test(
        name = name,
        data = data,
        templated_args = templated_args,
        tags = [
            "no-bazelci-mac",
            "no-bazelci-windows",
        ],
        **kwargs
    )

    # This rule is to update snapshots
    jest(
        name = "%s.update" % name,
        data = data,
        templated_args = templated_args + ["-u"],
        tags = [
            "no-bazelci-mac",
            "no-bazelci-windows",
        ],
        **kwargs
    )
