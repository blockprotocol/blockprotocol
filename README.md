# Block Protocol

The Block Protocol is an open standard for building and using data-driven blocks. Blocks developed in accordance with the protocol allow you to make websites and applications that are both more useful to and readable by humans and machines.

## Getting Started

Please refer to the [Block Protocol documentation](https://blockprotocol.org/docs) for complete instructions on using the Block Protocol, including:

- developing new blocks;
- publishing blocks to the Block Hub; and
- embedding blocks within your application.

## Usage

[HASH](https://github.com/hashintel/hash/tree/main/packages/hash) is an example embedding application for the Block Protocol.

For more examples, please refer to the [Block Protocol documentation](https://blockprotocol.org/docs) or browse the complete [Block Hub](https://blockprotocol.org/hub).

## Roadmap

_We’ll be publishing a public roadmap for the Block Protocol soon._

- See the [RFC category on GitHub Discussions](https://github.com/blockprotocol/blockprotocol/discussions/categories/rfc) for a list of active RFCs
- See the [open issues](https://github.com/blockprotocol/blockprotocol/issues?q=is%3Aissue+is%3Aopen) for a list of some other proposed features (and known issues).

## Repository contents

We welcome [contributions](#contributing) to this repository. Within it you will find folders for:

1.  `site`: the code for [blockprotocol.org](https://blockprotocol.org), including:

    - the [Block Protocol specification](https://blockprotocol.org/spec) at [src/\_pages/spec](https://github.com/blockprotocol/blockprotocol/tree/main/site/src/_pages/spec)
    - the [explanatory documentation](https://blockprotocol.org/docs) at [src/\_pages/docs](https://github.com/blockprotocol/blockprotocol/tree/main/site/src/_pages/docs)

1.  `packages`: utility packages for constructing Block Protocol blocks. These are all available via `yarn add <package_name>` or `npm install <package_name>`. See the individual README files in each folder for more details.
    - `block-template`: a template for a React-based block
    - `blockprotocol`: TypeScript types for Block Protocol properties and functions, as described in the spec
    - `create-block-app`: a script to [create a new block](https://blockprotocol.org/docs/developing-blocks) using `block-template`
    - `mock-block-dock`: a mock embedding application used for developing blocks

## Contributing

The Block Protocol is an open-source standard, and community contributions are what make open-source such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

Please consider **starring** the project and watching it on GitHub, to be kept abreast of future developments and show your appreciation.

If you’ve got an idea for a new block, would like to make a suggestion that improves the protocol itself, or want to contribute to a better developer experience for users of the protocol, then please either open an RFC, or open an issue with the tag “enhancement”. If you're unsure of which to do, read the ["When to follow this process" section of our RFC README](rfcs/README.md#when-to-follow-this-process)

Please feel free to fork the repo in order to create a pull request:

1.  Fork the Project
1.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
1.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
1.  Push to the Branch (`git push origin feature/AmazingFeature`)
1.  Open a Pull Request

If you’re looking for inspiration regarding new blocks to build, or contributions you could make, please check the [open issues](https://github.com/blockprotocol/blockprotocol/issues?q=is%3Aissue+is%3Aopen).

## License

Distributed under the MIT License. See `LICENSE.md` for more information.

## Contact

Find us on Twitter at [@blockprotocol](https://twitter.com/blockprotocol) or email [support@blockprotocol.org](mailto:support@blockprotocol.org)

You can also join our [community Discord server](https://blockprotocol.org/discord) for quick help and support.

Project permalink: `https://github.com/blockprotocol/blockprotocol`

## Acknowledgments

- [Ciaran Morinan](https://github.com/CiaranMn) - HASH ([profile](https://hash.ai/@ciaran))
- [Joel Spolsky](https://github.com/jspolsky) - HASH ([profile](https://hash.ai/@spolsky))
