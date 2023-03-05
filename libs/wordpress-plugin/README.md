## Getting started

This repository is for contributing to the WordPress plugin.

If you are looking to install it on your own WordPress server, please visit https://blockprotocol.org/wordpress

## Working on the plugin

### First time set up

- run `nvm use 16` (`@wordpress/scripts` does not currently support v18)
- run `yarn install`
- run `yarn dev:wordpress`
- visit [http://localhost:8000](http://localhost:8000)
- go through the WordPress set up flow
- go to Plugins in the sidebar, activate Block Protocol
- go to Block Protocol Settings in the sidebar, enter an API key

### Regular development

- `yarn dev:plugin` to run the plugin
- Optional: `yarn dev:wordpress` (to attach to Docker – useful for inspecting server logs)
- visit [http://localhost:8000](http://localhost:8000)
- amend `BLOCK_PROTOCOL_SITE_HOST` in `docker-compose.yml` if you want to test against a staging Block Hub

With `yarn dev:plugin` running, you can make changes to the source in `plugin/trunk` and refresh the WordPress page to see the change.
Why this works: we use `wordpress/docker-compose.yml` to mount the plugin folder into `/var/www/html/wp-content/plugins`.

Some changes (e.g. switching or patching dependencies) may require killing and restarting `yarn dev:plugin`.

### To inspect the db

- download a MySQL client and connect to http://localhost:3306 with the username/password from `wordpress/docker-compose-yml`
- entities are in the `wp_block_protocol_entities`

### Folder structure

`wordpress` contains a Docker compose file for a local WordPress (run on `yarn dev:wordpress`)
The `plugin` folder follows the same structure as in its [Subversion release repository]((https://plugins.trac.wordpress.org/browser/blockprotocol), i.e.:

- an `assets` folder which contains images for use on its [plugin directory page](https://wordpress.org/plugins/blockprotocol/)
- a `trunk` folder which represents the latest plugi ncode

In Subversion, there is an additional `tags` folder which contains the code for each release.

Within `trunk` there are:

- WordPress metadata files `readme.txt` and `changelog.txt`
- the main `block-protocol.php` file
- server-side code and utillities in `server/`
- the Block Protocol block (which loads other blocks) in `block/`, inside which:
  - `edit-or-preview.tsx` is the entry point for the admin view of the block
  - `render.tsx` is the script that runs on the user-facing page to render blocks into the appropriate divs
  - `block-loader.tsx` is shared between the above two and handles display of and communication with blocks
  - The folder structure is named so that any sub-folder contains private dependencies for files in the folder above it, e.g.
    - `src/edit/` contains files that are only used by `src/edit.tsx`
    - `src/edit/block-loader/` . contains files that are only used by `src/edit/block-loader.tsx`
    - and so on.

## Minimum WordPress Requirements

- **WordPress:** you must be running at least WordPress 5.6
- **PHP 7.4 or later:** your server must be running at least PHP 7.4. PHP 8.0 and 8.1 are also supported.
- **MySQL 8 _or_ MariaDB 10.2.7+:** your database must be using at least MySQL 8. Be aware, the previous version of MySQL (5.6 and 5.7) respectively reach(ed) end of life in February 2021 and October 2023. You should upgrade to MySQL 8 now to continue to receive security updates, as well as to use the Block Protocol within WordPress. As for MariaDB, although the plugin would work with an old version, we strongly recommend using the newest version available to you.
- **HTTPS:** your webhost must support HTTPS in order for the Block Protocol to properly function.

To check what your WordPress instance supports, please navigate to `Admin -> Tools -> Site Health -> Info` and then click into either `Server` (for PHP) or `Database` (for MySQL/MariaDB).

> Note that MariaDB is not fully supported by the plugin, and some features may not work as expected (blocks that make entity queries). This shouldn't get in the way of using the plugin, but it would degrade the experience somewhat. We recommend using MySQL 8+ if possible.

## Dependencies

We manage third-party PHP dependencies through [`composer`](https://getcomposer.org/). To prepare dependencies, run `composer install -d plugin` from the root of the repository. These dependencies are _not_ checked into the repository, so you'll need to run this command before bundling the plugin.

When running `composer`, you should use the minimum version of PHP that we support, such that we pull in the proper/most compatible dependencies.

## Roadmap

Our future plans include:

- Tons more blocks
- Allowing the use of existing data within your WordPress instance within blocks:
  - Exposing all WordPress _core_ entities as Þ types accessible to blocks (e.g. `Post`, `User`, etc.)
  - Exposing Custom Post Types as Þ types accessible to blocks
  - Support for Advanced Custom Fields
- Advanced security
  - Ability to enable a 'block sandbox' to allow untrusted/unreviewed block execution
  - Ability to switch from an 'allow list' (as at present) to a 'deny list' (provided block sandboxing is enabled)
- Faster / better rendering
  - reduce bundle size for the rendered page
  - server-side rendering of block

If you're interested in using a specific upcoming feature, please [contact us](https://blockprotocol.org/contact) or say 'hi!' on our [Discord server](https://blockprotocol.org/discord).

We prioritize developing features that users tell us they want, so your voice helps ensure the things you're looking forward to do actually ship sooner.

If there's an idea _not_ listed above that you're interested in seeing built, we'd also love to hear from you.

And if you'd like to help develop the Þ WordPress plugin, let us know a bit about yourself here or on Discord, and we can help you get started!

## Telemetry

When you install or use the _Block Protocol for WordPress_ plugin, we don’t send any data to any third-party analytics services. However, we do collect the domain name of the website that the plugin has been activated on, and limited aggregate information around the number of blocks, entities and types used. No information about the specific entities or types you use is transmitted, including their names or properties, and no personally identifiable information is collected. Information about critical errors and crashes may also be collected and reported as they occur. You can turn telemetry on or off at any time from the plugin’s settings panel. This telemetry data is used to help us identify and fix bugs and improve the Block Protocol. If you have any questions, please email support@blockprotocol.org
