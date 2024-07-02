## Getting started

This repository is for contributing to the WordPress plugin.

If you are looking to install the Block Protocol plugin for WordPress on your own site:

- [Download from the plugin directory](https://wordpress.org/plugins/blockprotocol/) to install on a self-hosted instance of WordPress _(wordpress.org)_
- [One-click install on WordPress.com](https://wordpress.com/plugins/blockprotocol/) to easily add the plugin to any hosted WordPress.com site

## Working on the plugin

### First time set up

- run `yarn`
- run `yarn dev:wordpress up`
- run `yarn dev:plugin`
- visit [http://localhost:8000](http://localhost:8000)
- go through the WordPress set up flow
- go to Plugins in the sidebar, activate Block Protocol
- go to Block Protocol Settings in the sidebar, enter an API key

### Regular development

- `yarn dev:plugin` to run the plugin
- `yarn dev:wordpress up` (WP server logs are visible in the output)
- visit [http://localhost:8000](http://localhost:8000)
- amend `BLOCK_PROTOCOL_SITE_HOST` in `docker-compose.yml` if you want to test against a staging Block Hub

With `yarn dev:plugin` running, you can make changes to the source in `plugin/trunk` and refresh the WordPress page to see the change.
Why this works: we use `wordpress/docker-compose.yml` to mount the plugin folder into `/var/www/html/wp-content/plugins`.

Some changes (e.g. switching or patching dependencies) may require killing and restarting `yarn dev:plugin`.

### To inspect the db

- download a MySQL client and connect to http://localhost:3306 with the username/password from `wordpress/docker-compose-yml`
- entities are in the `wp_block_protocol_entities`

### Folder structure

`wordpress` contains a Docker compose file for a local WordPress (run on `yarn dev:wordpress up`)
The `plugin` folder follows the same structure as in its [Subversion release repository](https://plugins.trac.wordpress.org/browser/blockprotocol), i.e.:

- an `assets` folder which contains images for use on its [plugin directory page](https://wordpress.org/plugins/blockprotocol/)
- a `trunk` folder which represents the latest plugin code

In Subversion, there is an additional `tags` folder which contains the code for each release.

Within `trunk` there are:

- WordPress metadata files `readme.txt` and `changelog.txt`
- the main `block-protocol.php` file
- server-side code and utillities in `server/`
- the Block Protocol block (which loads other blocks) in `block/`, inside which:
  - `edit-or-preview.tsx` is the entry point for the admin view of the block
  - `render.tsx` is the script that runs on the user-facing page to render blocks into the appropriate divs
  - `shared/*` is shared between the above two and handles display of and communication with blocks
  - The folder structure is named so that any sub-folder contains private dependencies for files in the folder above it, e.g.
    - `edit-or-preview/` contains files that are only used by `edit-or-preview.tsx`
    - `edit-or-preview/edit/` . contains files that are only used by `edit-or-preview/edit.tsx`
    - and so on.

### Publishing

`@TODO`: automate this process

#### Prerequisites

- Choose the appropriate semver version number (e.g. `0.1.0`), and then make sure it is reflected in the following places in `plugin/trunk/`:

  - in the header in `block-protocol.php` (two places)
  - the value for `BLOCK_PROTOCOL_PLUGIN_VERSION` in `block-protocol.php`
  - `Stable tag` in `readme.txt`
  - also update `version` in `package.json` (next to this README)

- Updating the changelog:

  - in `readme.txt`:
    - **replace** the current entry under `Changelog`
    - **replace** the current entry under `Upgrade Notice` (should be shorter, snappier than changelog – 300 chars max)
  - in `changelog.txt`:
    - **copy** the new `Changelog` entry from `readme.txt` to the top

- Commit these changes, have them reviewed and merged to `main`

#### Uploading to the WordPress plugin directory

1.  Run `yarn build`

1.  Create a zip of `plugin/trunk` and upload it to a test WordPress instance – don't leave the zip in `plugin/trunk`!

1.  Get an SVN Client

1.  Check out the SVN repository: [https://plugins.svn.wordpress.org/blockprotocol](https://plugins.svn.wordpress.org/blockprotocol)

1.  Replace the contents of `trunk` in the SVN repository with the contents of `plugin/trunk` in this repo (including build files)

1.  Check the diff and commit (you will need to log in with the 'plugin publishing' credentials)

1.  Create a new folder in `tags` in the SVN repository, e.g. `tags/0.1.0`

1.  Copy the contents of `trunk` into the new tag folder

1.  Commit

1.  Check that the version and changelog appears correctly on the [plugin's page](https://wordpress.org/plugins/blockprotocol/)

1.  Check that installing & upgrading the plugin from the directory works as expected

## Minimum WordPress Requirements

- **WordPress:** you must be running at least WordPress 5.6 (due to Composer autoload)
- **PHP 7.4 or later:** your server must be running at least PHP 7.4. PHP 8.0 and 8.1 are also supported.
- **MySQL 5.7.8+ _or_ MariaDB 10.2.7+:** your database must be using at least MySQL 5.7.8. Be aware, MySQL 5.6 and 5.7 respectively reach(ed) end of life in February 2021 and October 2023. You should upgrade to MySQL 8 now to continue to receive security updates, as well as to get the best Block Protocol experience within WordPress. As for MariaDB, although the plugin would work with an older version, we strongly recommend using the newest version available to you.
- **HTTPS:** your webhost must support HTTPS in order for the Block Protocol to properly function.

To check what your WordPress instance supports, please navigate to `Admin -> Tools -> Site Health -> Info` and then click into either `Server` (for PHP) or `Database` (for MySQL/MariaDB).

## Dependencies

We manage third-party PHP dependencies through [`composer`](https://getcomposer.org/). To prepare dependencies, run `composer install -d plugin` from the root of the repository. These dependencies are _not_ checked into the repository, so you'll need to run this command before bundling the plugin.

When running `composer`, you should use the minimum version of PHP that we support, such that we pull in the proper/most compatible dependencies.

## Roadmap

Our future plans include:

- Support for local mirroring of block source (allow blocks to be downloaded and served locally, rather than from the CDN)
- Integration of WordPress theme appearance variables with the forthcoming Þ Style module, to ensure seamless integration of blocks into rendered websites
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

If you're interested in using a specific upcoming feature, please [contact us](https://blockprotocol.org/contact).

We prioritize developing features that users tell us they want, so your voice helps ensure the things you're looking forward to do actually ship sooner.

If there's an idea _not_ listed above that you're interested in seeing built, or you'd like to actually help develop the Þ WordPress plugin, we'd also love to hear from you!

## Telemetry

When you install or use the _Block Protocol for WordPress_ plugin, we don’t send any data to any third-party analytics services. However, we do collect the domain name of the website that the plugin has been activated on, and limited aggregate information around the number of blocks, entities and types used. No information about the specific entities or types you use is transmitted, including their names or properties, and no personally identifiable information is collected. Information about critical errors and crashes may also be collected and reported as they occur. You can turn telemetry on or off at any time from the plugin’s settings panel. This telemetry data is used to help us identify and fix bugs and improve the Block Protocol. If you have any questions, please email support@blockprotocol.org
