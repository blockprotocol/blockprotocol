[block protocol docs]: https://blockprotocol.org/docs?utm_medium=organic&utm_source=github_readme_blockprotocol-repo_libs
[block-scripts]: block-scripts
[block-template-custom-element]: block-template-custom-element
[block-template-html]: block-template-html
[block-template-react]: block-template-react
[blockprotocol]: blockprotocol
[create-block-app]: create-block-app
[github_star]: https://github.com/blockprotocol/blockprotocol/tree/main/libs#
[mock-block-dock]: mock-block-dock
[wordpress-plugin]: wordpress-plugin

[![github_star](https://img.shields.io/github/stars/blockprotocol/blockprotocol?label=Star%20on%20GitHub&style=social)][github_star]

# Libraries

Contains the source code for Block Protocol development libraries and utilities, as well as plugins. Full write-ups of most can be found either in `README.md` files in each individual library folder or in the [Block Protocol docs], and a summary table will shortly be published below.

## Publishing

All libraries except those in `@local/` are published to `npm` via
[Changesets](https://github.com/changesets/changesets).

To record a change for publication:

1.  From the root of the repository, run `yarn changeset`
1.  Select the package(s) affected by this change (space to select, enter to move to the next step)
    - Do not worry about selecting packages which depend on changed packages – Changesets will handle bumping them
1.  Select the semver increment
1.  Describe the change
1.  Commit the created changeset file

When a PR with a changeset file is merged, the change is added to a PR entitled 'Version Packages',
which has a diff showing the version increments which will be applied to affected packages, including dependents.

Once the 'Version Packages' PR is merged, the changes are published to npm.

Canary versions can be published by running the `Canary Release` workflow in GitHub Actions, and selecting the branch which contains changesets to publish.
