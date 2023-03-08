=== Block Protocol ===
Contributors: ciaranmn,nonparibus,asahash,spolsky
Donate link: https://github.com/sponsors/blockprotocol
Tags: block protocol, blocks, gutenberg, gutenberg blocks, block, schema, countdown block, timer block, person block, code block, drawing block, shuffle block
Requires at least: 5.6.0
Tested up to: 6.1.1
Requires PHP: 7.4
Stable tag: 0.0.3
License: AGPL-3.0
License URI: https://www.gnu.org/licenses/agpl-3.0.en.html

Access a growing collection of high-quality and powerful blocks with a one-time plugin install.

== Description ==

The [Block Protocol](https://blockprotocol.org) plugin gives you an ever-growing set of high-quality blocks to use in your WordPress site. 

Discover and use new blocks when you need them, directly from within the WordPress Gutenberg Editor. No more installing new plugins to get more blocks.

In addition to useful blocks like Callouts, Headings, Images, and Quotes, the Block Protocol plugin provides powerful, new blocks for services such as OpenAI, and Mapbox.

You can also build your own block for the Block Protocol and publish it instantly. 

To get started building a block, [check out the documentation](https://blockprotocol.org/docs/developing-blocks).

== Installation ==

**1.** Activate the plugin from the Plugins Setting page

**2.** Visit https://blockprotocol.org to create an account and generate an API key: https://blockprotocol.org/settings/api-keys

**3.** Click 'Block Protocol' in the WordPress sidebar, enter your API key, and save – if there's no warning message, it's working

**4.** Use the regular WordPress block insertion menu to find and insert Block Protocol blocks

**5.** If you want to add your own block to the plugin, visit https://blockprotocol.org/docs/developing-blocks

Note that you must be using at least MySQL 8. To check please navigate to `Admin -> Tools -> Site Health -> Info -> Database`.
The previous versions of MySQL (5.6 and 5.7) respectively reach(ed) end of life in February 2021 and October 2023. 
You should upgrade to MySQL 8 now to continue to receive security updates, as well as to use the Block Protocol within WordPress.

When you install or use the _Block Protocol for WordPress_ plugin, we don’t send any data to any third-party analytics services. 
However, we do collect the domain name of the website that the plugin has been activated on, and limited aggregate information 
around the number of blocks, entities and types used. No information about the specific entities or types you use is transmitted, 
including their names or properties, and no personally identifiable information is collected. Information about critical errors and 
crashes may also be collected and reported as they occur. You can turn telemetry on or off at any time from the plugin’s settings panel. 
This telemetry data is used to help us identify and fix bugs and improve the Block Protocol. If you have any questions,
please email support@blockprotocol.org

== Frequently Asked Questions ==

= How does the Block Protocol plugin work? =
The Block Protocol plugin gives you an ever-expanding catalogue of blocks to use within your WordPress site.

These blocks are developed either by HASH, the company behind the protocol, or third-party developers.

More blocks are being published all the time, and they become available via the plugin immediately, without the need to upgrade.

= What is the Block Protocol? =
The Block Protocol is an open standard for building block-based interfaces.

Each block that uses the protocol can be used in any application which supports it.

WordPress is one of these applications. [HASH](https://hash.ai), an all-in-one platform for decision making developed by the company behind the Block Protocol, is another. More are planned, including Figma and GitHub.

= Can I create a block for the Block Protocol? =

Absolutely. You can start coding your block in minutes and, once finished, publish your block instantly.
[Check out the docs to get started](https://blockprotocol.org/docs/developing-blocks).

= How might it change? =

The Block Protocol is a new, evolving specification – features are being added all the time to enable blocks with a wider range of features.

This means that certain versions of blocks will only work with certain versions of the plugin.

The changelog and upgrade notices will make clear when any breaking changes are introduced.

== Need help? ==

Please [contact us](https://blockprotocol.org/contact) or say 'hi!' on our [Discord server](https://blockprotocol.org/discord) if you need help, have a question, or if you have suggestions for the plugin or new blocks.

== Changelog ==

<!-- The latest release should be found here, and older ones moved to changelog.txt -->

= 0.0.3 =
* Notification when using unsupported database version
* Fix rich text rendering
* Icon for block category
* Better error reporting

== Upgrade Notice ==

= 0.0.3 =
Upgrade for improved text rendering in Block Protocol blocks

<!--
= 1.0 =
Upgrade notices describe the reason a user should upgrade.  No more than 300 characters.
-->