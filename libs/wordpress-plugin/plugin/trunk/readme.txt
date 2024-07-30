=== Block Protocol ===
Contributors: ciaranmn,nonparibus,spolsky
Tags: block protocol, blocks, gutenberg, gutenberg blocks, block, schema, countdown block, timer block, person block, code block, drawing block, shuffle block
Requires at least: 5.6.0
Tested up to: 6.2
Requires PHP: 7.4
Stable tag: 0.0.9
License: AGPL-3.0
License URI: https://www.gnu.org/licenses/agpl-3.0.en.html

Access a growing collection of high-quality and powerful blocks with a one-time plugin install.

== Description ==

Install the [Block Protocol](https://blockprotocol.org/?utm_medium=organic&utm_source=wordpress-plugin_readme) plugin to access an ever-growing library of high-quality blocks within WordPress. 

Discover and use new blocks when you need them, at the point of insertion, directly from within the WordPress editor. No more installing new plugins to get more blocks.

- Blocks that provide access to external services including **OpenAI** and **Mapbox**, without needing to sign up for these separately
- Structured data blocks with SEO benefits for your website, helping you rank more highly in Google and Bing (e.g. the [Address](https://blockprotocol.org/@hash/blocks/address?utm_medium=organic&utm_source=wordpress-plugin_readme) and [How-to](https://blockprotocol.org/@hash/blocks/how-to?utm_medium=organic&utm_source=wordpress-plugin_readme) blocks)
- Interactive blocks such as the [drawing](https://blockprotocol.org/@tldraw/blocks/drawing?utm_medium=organic&utm_source=wordpress-plugin_readme) and [countdown timer](https://blockprotocol.org/@hash/blocks/timer?utm_medium=organic&utm_source=wordpress-plugin_readme) blocks
- "Traditional" content management blocks such as [callouts](https://blockprotocol.org/@hash/blocks/callout?utm_medium=organic&utm_source=wordpress-plugin_readme), [tables](https://blockprotocol.org/@hash/blocks/table?utm_medium=organic&utm_source=wordpress-plugin_readme), headings, images, and quotes

You can also build your own block for the Block Protocol without any PHP, and publish it instantly.  To build a block, [check out the developer docs](https://blockprotocol.org/docs/developing-blocks?utm_medium=organic&utm_source=wordpress-plugin_readme).

== Installation ==

**1.** Activate the plugin from the Plugins Setting page

**2.** Visit https://blockprotocol.org to create an account and generate an API key: https://blockprotocol.org/account/api

**3.** Click 'Block Protocol' in the WordPress sidebar, enter your API key, and save – if there's no warning message, it's working

**4.** Use the regular WordPress block insertion menu to find and insert Block Protocol blocks

**5.** If you want to add your own block to the plugin, visit https://blockprotocol.org/docs/developing-blocks

Note that you must be using at least MySQL 5.7.8 or MariaDB 10.2.7. To check please navigate to `Admin -> Tools -> Site Health -> Info -> Database`.
**MySQL 5.6** and **5.7** reach(ed) end of life in February 2021 and October 2023; and **MariaDB 10.2** and **10.3** in May 2022 and May 2023, respectively.
You should upgrade to MySQL 8 (or MariaDB 10.11) now to continue to receive security updates, as well as to get the best Block Protocol experience within WordPress.

When you install or use the _Block Protocol for WordPress_ plugin, we don’t send any data to any third-party analytics services. 
However, we do collect the domain name of the website that the plugin has been activated on, and limited aggregate information 
around the number of blocks, entities and types used. No information about the specific entities or types you use is transmitted, 
including their names or properties, and no personally identifiable information is collected. Information about critical errors and 
crashes may also be collected and reported as they occur. You can turn telemetry on or off at any time from the plugin’s settings panel. 
This telemetry data is used to help us identify and fix bugs and improve the Block Protocol. If you have any questions,
please [contact us](https://blockprotocol.org/contact?utm_medium=organic&utm_source=wordpress-plugin_readme).

== Frequently Asked Questions ==

= How does the Block Protocol plugin work? =
The Block Protocol plugin gives you an ever-expanding catalogue of blocks to use within your WordPress site.

These blocks are developed either by HASH, the company behind the protocol, or third-party developers.

More blocks are being published all the time, and they become available via the plugin immediately, without the need to upgrade.

= What is the Block Protocol? =
The Block Protocol is an open standard for building block-based interfaces.

Each block that uses the protocol can be used in any application which supports it.

WordPress is one of these applications. [HASH](https://hash.ai/?utm_medium=organic&utm_source=wordpress-plugin_readme), an all-in-one platform for decision making developed by the company behind the Block Protocol, is another. More are planned, including Figma and GitHub.

= Can I create a block for the Block Protocol? =

Absolutely. You can start coding your block in minutes and, once finished, publish your block instantly. [Check out the docs to get started](https://blockprotocol.org/docs/developing-blocks/?utm_medium=organic&utm_source=wordpress-plugin_readme).

= How might it change? =

The Block Protocol is a new, evolving specification – features are being added all the time to enable blocks with a wider range of features.

This means that certain versions of blocks will only work with certain versions of the plugin.

The changelog and upgrade notices will make clear when any breaking changes are introduced.

== Need help? ==

Please [contact us](https://blockprotocol.org/contact?utm_medium=organic&utm_source=wordpress-plugin_readme) if you need help, have questions, or want to make a suggestion for the plugin or new blocks.

== Changelog ==

<!-- Only the latest release's entry should appear here – the full log should be in changelog.txt -->

= 0.0.9 =
* Bump write key used for data reporting

== Upgrade Notice ==

<!-- Upgrade notices describe the reason a user should upgrade. No more than 300 characters. -->

= 0.0.9 =
Update to allow data reporting to continue
