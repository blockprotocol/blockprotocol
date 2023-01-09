[github_banner]: https://blockprotocol.org/?utm_medium=organic&utm_source=github_readme_blockprotocol-repo_root
[github_star]: https://github.com/blockprotocol/blockprotocol#
[open issues]: https://github.com/blockprotocol/blockprotocol/issues?q=is%3Aissue+is%3Aopen
[discord]: https://blockprotocol.org/discord?utm_medium=organic&utm_source=github_readme_blockprotocol-repo_root
[hash]: https://github.com/hashintel/hash/tree/main/libs/hash
[blockprotocol.org]: https://blockprotocol.org/?utm_medium=organic&utm_source=github_readme_blockprotocol-repo_root
[þ hub]: https://blockprotocol.org/hub?utm_medium=organic&utm_source=github_readme_blockprotocol-repo_root
[block protocol specification]: https://blockprotocol.org/docs/spec?utm_medium=organic&utm_source=github_readme_blockprotocol-repo_root
[core specification]: https://blockprotocol.org/docs/spec/core?utm_medium=organic&utm_source=github_readme_blockprotocol-repo_root
[graph service]: https://blockprotocol.org/docs/spec/graph-service?utm_medium=organic&utm_source=github_readme_blockprotocol-repo_root
[hook service]: https://blockprotocol.org/docs/spec/hook-service?utm_medium=organic&utm_source=github_readme_blockprotocol-repo_root
[block protocol documentation]: https://blockprotocol.org/docs?utm_medium=organic&utm_source=github_readme_blockprotocol-repo_root
[create a new block]: https://blockprotocol.org/docs/developing-blocks?utm_medium=organic&utm_source=github_readme_blockprotocol-repo_root
[developing blocks]: https://blockprotocol.org/docs/developing-blocks?utm_medium=organic&utm_source=github_readme_blockprotocol-repo_root
[using blocks]: https://blockprotocol.org/docs/using-blocks?utm_medium=organic&utm_source=github_readme_blockprotocol-repo_root
[becoming an embedder]: https://blockprotocol.org/docs/embedding-blocks?utm_medium=organic&utm_source=github_readme_blockprotocol-repo_root
[rfcs & roadmap]: https://blockprotocol.org/docs/spec/rfcs_and_roadmap?utm_medium=organic&utm_source=github_readme_blockprotocol-repo_root

[![github_banner](https://static.blockprotocol.com/cdn-cgi/imagedelivery/EipKtqu98OotgfhvKf6Eew/f8b0bf95-88ea-47ea-cac2-49cb2851b700/github)][github_banner]

[![discord](https://img.shields.io/discord/1050770647564943402)][discord] [![github_star](https://img.shields.io/github/stars/blockprotocol/blockprotocol?label=Star%20on%20GitHub&style=social)][github_star]

# Block Protocol

The Block Protocol is an open standard for building and using data-driven blocks. Blocks developed in accordance with the protocol allow you to make websites and applications that are both more useful to and readable by humans and machines. Neither blocks nor the applications that embed them require any knowledge of each other's existence. Both need only conform to the protocol.

## Getting Started

Please refer to the [Block Protocol documentation] for complete instructions on using the Block Protocol, including:

- [developing blocks] and publishing them to the [Þ Hub]
- [using blocks] inside other applications
- [becoming an embedder] so that others can use blocks within your application or framework

## Examples

[HASH] is an embedding application that supports the Block Protocol, enabling its users to insert arbitrary blocks from the [Þ Hub] at runtime.

For more examples, please refer to the [Block Protocol documentation] or browse the complete [Þ Hub].

## Roadmap

Learn more on our [RFCs & Roadmap] page in the docs.

- See the [RFC category on GitHub Discussions](https://github.com/blockprotocol/blockprotocol/discussions/categories/rfc) for a list of active RFCs
- See the [open issues] for a list of some other proposed features (and known issues).

## Repository contents

We welcome [contributions](#contributing) to this repository. Within it you will find folders for:

1.  `apps/site`: the code for [blockprotocol.org], including:

    - the [Block Protocol specification] ([view on GitHub](https://github.com/blockprotocol/blockprotocol/tree/main/apps/site/src/_pages/docs/4_spec))
    - the [Block Protocol documentation] ([view on GitHub](https://github.com/blockprotocol/blockprotocol/tree/main/apps/site/src/_pages/docs))

1.  `libs`: libraries that are published as NPM packages or used locally in this monorepo. The former ones are available externally via `yarn add <package_name>` or `npm install <package_name>`. See the individual README files in each folder for more details.

    - `@blockprotocol/core`: implements the Block Protocol [Core specification] for blocks and embedding applications
    - `@blockprotocol/graph`: implements the Block Protocol [Graph service] for blocks and embedding applications
    - `@blockprotocol/hook`: implements the Block Protocol [Hook service] for blocks and embedding applications
    - `@blockprotocol/type-system`: implements the type system (with code autogenerated from `crates/type-system`)
    - `@local/*`: auxiliary Yarn workspaces for local development and testing
    - `block-scripts`: scripts used by `block-template-*`
    - `block-template-*`: starter templates for blocks, used by `create-block-app`
    - `blockprotocol`: command line interface for interacting with the Block Protocol API, e.g. for publishing blocks
    - `create-block-app`: a script to [create a new block] using `block-template-*`
    - `mock-block-dock`: a lightweight mock embedding application that can be used to test blocks during their development

1.  `rfcs`: contains RFCs (Requests For Comments); this folder is intended to maintain a consistent and controlled process for new features to enter the project.

## Contributing

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

## License

The vast majority of this repository is dual-licensed under the Apache 2.0 and MIT licenses, at your option. See the [LICENSE](LICENSE.md) file for more information.

## Contact

Find us on Twitter at [@blockprotocol](https://twitter.com/blockprotocol) or email [support@blockprotocol.org](mailto:support@blockprotocol.org)

You can also join our [Discord] community for quick help and support.

Project permalink: `https://github.com/blockprotocol/blockprotocol`

## Acknowledgments

- [Ciaran Morinan](https://github.com/CiaranMn) - HASH ([profile](https://hash.ai/@ciaran))
- [Joel Spolsky](https://github.com/jspolsky) - HASH ([profile](https://hash.ai/@spolsky))
