[þ hub]: https://blockprotocol.org/hub?utm_medium=organic&utm_source=github_readme_blockprotocol-repo_root
[block protocol]: https://blockprotocol.org/?utm_medium=organic&utm_source=github_readme_blockprotocol-repo_root
[block protocol documentation]: https://blockprotocol.org/docs?utm_medium=organic&utm_source=github_readme_blockprotocol-repo_root
[block protocol specification]: https://blockprotocol.org/docs/spec?utm_medium=organic&utm_source=github_readme_blockprotocol-repo_root
[blockprotocol.org]: https://blockprotocol.org/?utm_medium=organic&utm_source=github_readme_blockprotocol-repo_root
[becoming an embedder]: https://blockprotocol.org/docs/embedding-blocks?utm_medium=organic&utm_source=github_readme_blockprotocol-repo_root
[create a new block]: https://blockprotocol.org/docs/developing-blocks?utm_medium=organic&utm_source=github_readme_blockprotocol-repo_root
[core specification]: https://blockprotocol.org/docs/spec/core?utm_medium=organic&utm_source=github_readme_blockprotocol-repo_root
[developing blocks]: https://blockprotocol.org/docs/developing-blocks?utm_medium=organic&utm_source=github_readme_blockprotocol-repo_root
[discord]: https://blockprotocol.org/discord?utm_medium=organic&utm_source=github_readme_blockprotocol-repo_root
[graph service]: https://blockprotocol.org/docs/spec/graph-service?utm_medium=organic&utm_source=github_readme_blockprotocol-repo_root
[hook service]: https://blockprotocol.org/docs/spec/hook-service?utm_medium=organic&utm_source=github_readme_blockprotocol-repo_root
[rfcs & roadmap]: https://blockprotocol.org/docs/spec/rfcs_and_roadmap?utm_medium=organic&utm_source=github_readme_blockprotocol-repo_root
[using blocks]: https://blockprotocol.org/docs/using-blocks?utm_medium=organic&utm_source=github_readme_blockprotocol-repo_root
[open issues]: https://github.com/blockprotocol/blockprotocol/issues?q=is%3Aissue+is%3Aopen
[hash]: https://github.com/hashintel/hash/tree/main/apps/hash

<!-- markdownlint-disable link-fragments -->

[github_banner]: #block-protocol
[github_star]: https://github.com/blockprotocol/blockprotocol#
[gh-what-is-the-bp]: #--what-is-the-block-protocol
[gh-getting-started]: #--getting-started
[gh-examples]: #--examples
[gh-roadmap]: #--roadmap
[gh-repo-overview]: #--repository-overview
[gh-contributing]: #--contributing
[gh-license]: #--license
[gh-security]: #--license
[gh-contact]: #--contact
[gh-acknowledgments]: #--acknowledgments

[![github_banner](https://static.blockprotocol.com/cdn-cgi/imagedelivery/EipKtqu98OotgfhvKf6Eew/f8b0bf95-88ea-47ea-cac2-49cb2851b700/github)][github_banner]

[![discord](https://img.shields.io/discord/1050770647564943402)][discord] [![github_star](https://img.shields.io/github/stars/blockprotocol/blockprotocol?label=Star%20on%20GitHub&style=social)][github_star]

# Block Protocol

Public monorepo for the _[Block Protocol]_.

## [![gh-what-is-the-bp](/.github/assets/gh_icon_what-is-the-block-protocol_20px-base.svg)][gh-what-is-the-bp] &nbsp; What is the Block Protocol?

The Block Protocol is an open standard for building and using data-driven blocks. Blocks developed in accordance with the protocol allow you to make websites and applications that are both more useful to and readable by humans and machines. Neither blocks nor the applications that embed them require any knowledge of each other's existence. Both need only conform to the protocol.

## [![a](/.github/assets/gh_icon_getting-started_20px-base.svg)][gh-getting-started] &nbsp; Getting Started

Please refer to the [Block Protocol documentation] for complete instructions on using the Block Protocol, including:

- [developing blocks] and publishing them to the [Þ Hub]
- [using blocks] inside other applications
- [becoming an embedder] so that others can use blocks within your application or framework

## [![a](/.github/assets/gh_icon_examples_20px-base.svg)][gh-examples] &nbsp; Examples

[HASH] is an embedding application that supports the Block Protocol, enabling its users to insert arbitrary blocks from the [Þ Hub] at runtime.

For more examples, please refer to the [Block Protocol documentation] or browse the complete [Þ Hub].

## [![a](/.github/assets/gh_icon_roadmap_20px-base.svg)][gh-roadmap] &nbsp; Roadmap

Learn more on our [RFCs & Roadmap] page in the docs.

- See the [RFC category on GitHub Discussions](https://github.com/blockprotocol/blockprotocol/discussions/categories/rfc) for a list of active RFCs
- See the [open issues] for a list of some other proposed features (and known issues).

## [![a](/.github/assets/gh_icon_repo-overview_20px-base.svg)][gh-repo-overview] &nbsp; Repository overview

Finding things within a monorepo isn't always straight forward, in particular if you're an external contributor looking at a repository for the first time. We've tried to logically separate our repo into executable **applications** or tools (`apps`), and developer **libraries** including packages and crates (`libs`). As an open-source community project, we welcome [contributions](#contributing).

### For block and application developers

As a block developer, you probably care most about our utility libraries. All of those listed below are contained within the [`libs`](https://github.com/blockprotocol/blockprotocol/tree/main/libs/) folder and are available via `yarn add <package_name>` or `npm install <package_name>`. Individual README files within each directory provide more details.

- [`@blockprotocol/core`](https://github.com/blockprotocol/blockprotocol/tree/main/libs/@blockprotocol/core): implements the Block Protocol [Core specification] for blocks and embedding applications
- [`@blockprotocol/graph`](https://github.com/blockprotocol/blockprotocol/tree/main/libs/@blockprotocol/graph): implements the Block Protocol [Graph service] for blocks and embedding applications
- [`@blockprotocol/hook`](https://github.com/blockprotocol/blockprotocol/tree/main/libs/@blockprotocol/hook): implements the Block Protocol [Hook service] for blocks and embedding applications
- [`@blockprotocol/type-system`](https://github.com/blockprotocol/blockprotocol/tree/main/libs/@blockprotocol/type-system): implements the type system as a WASM-based npm package (with code autogenerated from `crate` subfolder)
- [`@local/*`](https://github.com/blockprotocol/blockprotocol/tree/main/libs/@local): auxiliary Yarn workspaces for local development and testing
- [`block-scripts`](https://github.com/blockprotocol/blockprotocol/tree/main/libs/block-scripts): scripts used by `block-template-*`
- `block-template-*`: starter templates for blocks, used by `create-block-app`
- [`blockprotocol`](https://github.com/blockprotocol/blockprotocol/tree/main/libs/blockprotocol): command line interface for interacting with the Block Protocol API, e.g. for publishing blocks
- [`create-block-app`](https://github.com/blockprotocol/blockprotocol/tree/main/libs/create-block-app): a script to [create a new block] using `block-template-*`
- [`mock-block-dock`](https://github.com/blockprotocol/blockprotocol/tree/main/libs/mock-block-dock): a lightweight mock embedding application that can be used to test blocks during their development

### For spec and site contributors

1.  [`apps/site`](https://github.com/blockprotocol/blockprotocol/tree/main/apps/site): the code for [blockprotocol.org], including:

    - the [Block Protocol specification] ([view on GitHub](https://github.com/blockprotocol/blockprotocol/tree/main/apps/site/src/_pages/docs/4_spec))
    - the [Block Protocol documentation] ([view on GitHub](https://github.com/blockprotocol/blockprotocol/tree/main/apps/site/src/_pages/docs))

1.  [`rfcs`](https://github.com/blockprotocol/blockprotocol/tree/main/rfcs): contains RFCs (Requests For Comments); this folder is intended to maintain a consistent and controlled process for new features to enter the project

1.  [`libs/@blockprotocol/type-system`](https://github.com/blockprotocol/blockprotocol/tree/main/libs/@blockprotocol/type-system): Rust crate which auto-generates a WASM-based npm package, providing a single source of truth for type system definitions

## [![a](/.github/assets/gh_icon_contributing_20px-base.svg)][gh-contributing] &nbsp; Contributing

The Block Protocol is an open-source standard, and community contributions are what make open-source such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

Please consider **starring** the project and **watching** it on GitHub, to be kept abreast of future developments and show your appreciation.

If you’ve got an idea for a new block, would like to make a suggestion that improves the protocol itself, or want to contribute to a better developer experience for users of the protocol, then please either open an RFC, or open an issue with the tag “enhancement”. If you're unsure as to which is more appropriate, read the ["When to follow this process" section of our RFC README](rfcs/README.md#when-to-follow-this-process).

Please feel free to fork the repo in order to create a pull request:

1.  Fork the project
1.  Create your feature branch (`git checkout -b feature/AmazingFeature`)
1.  Commit your changes (`git commit -m 'Add some AmazingFeature'`)
1.  Push to the branch (`git push origin feature/AmazingFeature`)
1.  Open a pull request targeting this repo

If you’re looking for inspiration regarding new blocks to build, or contributions you could make, please check the [open issues].

## [![a](/.github/assets/gh_icon_license_20px-base.svg)][gh-license] &nbsp; License

The vast majority of this repository is dual-licensed under the Apache 2.0 and MIT licenses, at your option. See the [LICENSE](LICENSE.md) file for more information.

## [![a](/.github/assets/gh_icon_security_20px-base.svg)][gh-security] &nbsp; Security

Please see [SECURITY](SECURITY.md) for instructions around reporting issues, and details of which package versions we actively support.

## [![a](/.github/assets/gh_icon_contact_20px-base.svg)][gh-contact] &nbsp; Contact

Find us on Twitter at [@blockprotocol](https://twitter.com/blockprotocol) or email [support@blockprotocol.org](mailto:support@blockprotocol.org)

You can also join our [Discord] community for quick help and support.

Project permalink: `https://github.com/blockprotocol/blockprotocol`

## [![a](/.github/assets/gh_icon_acknowledgement_20px-base.svg)][gh-acknowledgments] &nbsp; Acknowledgments

- [Ciaran Morinan](https://github.com/CiaranMn) - HASH ([profile](https://hash.ai/@ciaran))
- [Joel Spolsky](https://github.com/jspolsky) - HASH ([profile](https://hash.ai/@spolsky))
