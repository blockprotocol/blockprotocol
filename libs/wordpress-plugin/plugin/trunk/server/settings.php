<?php
require_once __DIR__ . '/util.php';
require_once __DIR__ . '/activate.php';

/**
 * @internal never define functions inside callbacks.
 * these functions could be run multiple times; this would result in a fatal error.
 */


function block_protocol_update_options($next) {
    $options = get_option('block_protocol_options');
    update_option('block_protocol_options', array_merge(is_array($options) ? $options : [], $next));
}


function block_protocol_settings_enqueue_assets($hook) {
    if ($hook !== 'toplevel_page_block_protocol') {
        return;
    }

    wp_enqueue_style('block_protocol_typekit', 'https://use.typekit.net/muv5tib.css');
    wp_enqueue_style('block_protocol_global', plugins_url('../settings/settings.css', __FILE__));

    $asset_file = include(plugin_dir_path(__FILE__) . '../build/settings.asset.php');

    wp_register_script(
        'block_protocol_settings',
        plugins_url('../build/settings.js', __FILE__),
        $asset_file['dependencies'],
        $asset_file['version']
    );
    wp_enqueue_script('block_protocol_settings');
}

add_action('admin_enqueue_scripts', 'block_protocol_settings_enqueue_assets');

function block_protocol_remove_key()
{
    check_admin_referer('block_protocol_remove_key');
    block_protocol_update_options([
            'block_protocol_field_api_email' => '',
            'block_protocol_field_api_key' => '',
            'block_protocol_field_api_email_verification_id' => '',
        ]
    );
    exit(wp_redirect(admin_url('admin.php?page=block_protocol')));
}

add_action('admin_post_block_protocol_remove_key', 'block_protocol_remove_key');

/**
 * custom option and settings
 */
function block_protocol_settings_init()
{
    // Register a new setting for "block_protocol" page.
    register_setting('block_protocol', 'block_protocol_options', [
        'default' => [
            'block_protocol_field_api_email' => '',
            'block_protocol_field_api_email_verification_id' => '',
            'block_protocol_field_api_key' => '',
            'block_protocol_field_allow_unverified' => 'off',
            'block_protocol_field_plugin_usage' => 'on',
            'block_protocol_field_author_allow_list' => [],
        ]
    ]);

    // ------- Settings related to the BP API key --------- //
    add_settings_section(
        'block_protocol_section_api_account',
        __('blockprotocol.org Account', 'block_protocol'),
        'block_protocol_section_api_key_intro',
        'block_protocol'
    );

    add_settings_field(
        'block_protocol_field_api_key',
        __('Key', 'block_protocol'),
        'block_protocol_field_api_key_renderer',
        'block_protocol',
        'block_protocol_section_api_account',
        [
            'label_for' => 'block_protocol_field_api_key',
            'class' => 'block_protocol_row',
        ]
    );

    // ------- Settings related to permitted blocks --------- //

    add_settings_section(
        'block_protocol_section_permitted_blocks',
        __('Permitted blocks', 'block_protocol'),
        'block_protocol_section_permitted_blocks_intro',
        'block_protocol'
    );

    add_settings_field(
        'block_protocol_field_allow_unverified',
        __('Allow unverified blocks', 'block_protocol'),
        'block_protocol_field_allow_unverified_renderer',
        'block_protocol',
        'block_protocol_section_permitted_blocks',
        [
            'label_for' => 'block_protocol_field_allow_unverified',
            'class' => 'block_protocol_row',
        ]
    );

    add_settings_section(
        'block_protocol_section_permitted_blocks_author_allow_list',
        '',
        'block_protocol_section_permitted_blocks_author_allow_list_intro',
        'block_protocol'
    );
    add_settings_field(
        'block_protocol_field_author_allow_list',
        __('Trust block publishers', 'block_protocol'),
        'block_protocol_field_author_allow_list_renderer',
        'block_protocol',
        'block_protocol_section_permitted_blocks_author_allow_list',
        [
            'label_for' => 'block_protocol_field_author_allow_list',
            'class' => 'block_protocol_row',
        ]
    );

    // ------- Settings related to plugin usage --------- //

    add_settings_section(
        'block_protocol_section_plugin_usage',
        __('Crash reporting and telemetry', 'block_protocol'),
        'block_protocol_section_plugin_usage_intro',
        'block_protocol'
    );

    add_settings_field(
        'block_protocol_field_plugin_usage',
        __('Enable reporting', 'block_protocol'),
        'block_protocol_field_plugin_usage_renderer',
        'block_protocol',
        'block_protocol_section_plugin_usage',
        [
            'label_for' => 'block_protocol_field_plugin_usage',
            'class' => 'block_protocol_row',
        ]
    );
}

/**
 * Register our block_protocol_settings_init to the admin_init action hook.
 */
add_action('admin_init', 'block_protocol_settings_init');


/**
 * Intro to the API key section
 *
 * @param array $args  The settings array, defining title, id, callback.
 */
function block_protocol_section_api_key_intro($args)
{
}

/**
 * block_protocol_field_api_key field callback function.
 *
 * WordPress has magic interaction with the following keys: label_for, class.
 * - the "label_for" key value is used for the "for" attribute of the <label>.
 * - the "class" key value is used for the "class" attribute of the <tr> containing the field.
 * Note: you can add custom key value pairs to be used inside your callbacks.
 *
 * @param array $args
 */
function block_protocol_field_api_key_renderer($args)
{
    // Get the value of the setting we've registered with register_setting()
    $options = get_option('block_protocol_options');
    $public = explode('.', $options[$args['label_for']])[1];
    ?>
    <p style="max-width:570px;">
        <?= isset($options['block_protocol_field_api_email']) ? sprintf(__('This WordPress instance is linked to your <strong>%s</strong> Block Protocol account.', 'block_protocol'), htmlentities($options['block_protocol_field_api_email'])) : 'This WordPress instance is linked to your Block Protocol account.'; ?>
        The public portion of the API key linked to this account is shown below.
    </p>
    <input id="<?php echo esc_attr($args['label_for']); ?>"
           type="text"
           class="BPSettingsInput"
           style="margin:12px 0"
           disabled
           value="<?= esc_attr($public); ?>" />
    <br />
    <a style="color:black" href="<?= wp_nonce_url(admin_url('admin-post.php?action=block_protocol_remove_key'), 'block_protocol_remove_key') ?>"><?= __('Detach keys from this website', 'block_protocol'); ?></a> | <a target="_blank" rel="noopener noreferrer" href="<?=get_block_protocol_site_host()?>/account/api"><?= __('Manage or create API keys', 'block_protocol'); ?></a>
    <?php
}

/**
 * Intro to the Permitted Blocks section
 *
 * @param array $args  The settings array, defining title, id, callback.
 */
function block_protocol_section_permitted_blocks_intro($args)
{
    ?>
    <p id="<?php echo esc_attr($args['id']); ?>">
    <p><strong>WARNING:</strong> checking this box will allow users to use ANY block.</p>

    <p>Checking this is <strong>not</strong> recommended, as it permits users to load unchecked third-party code that may
        pose a security risk.
    </p>
    <p>
        See which blocks are verified and read more about verification on the <a href="https://blockprotocol.org/hub"
            target="_blank">Block
            Hub</a>
    </p>
    <?php
}

function block_protocol_field_allow_unverified_renderer($args)
{
    $options = get_option('block_protocol_options');
    ?>
    <input id="<?php echo esc_attr($args['label_for']); ?>"
        name="block_protocol_options[<?php echo esc_attr($args['label_for']); ?>]" type="checkbox" <?php
           checked(($options[$args['label_for']] ?? 'off') == 'on') ?>>
    </input>
    <?php
}

function block_protocol_section_permitted_blocks_author_allow_list_intro($args)
{
    ?>
    <p id="<?php echo esc_attr($args['id']); ?>" style="margin-bottom: 0;">
        Checking a publisher below will trust any block from that publisher, regardless of verification status.
    </p>
    <?php
}

function block_protocol_field_author_allow_list_renderer($args)
{
    $options = get_option('block_protocol_options');
    $authors = array_fill_keys($options[$args['label_for']] ?? [], TRUE);

    $blocks = get_block_protocol_blocks();
    if (!isset($blocks['errors'])) {
        $block_authors = array_fill_keys(
            array_map(function ($block) {
                return $block['author'];
            }, $blocks),
            FALSE
        );

        $authors = array_merge(
            $block_authors,
            $authors,
        );

        // Sort by checked, then by name so we get all checked first
        uksort($authors, function ($a, $b) use ($authors) {
            if ($authors[$a] == $authors[$b]) {
                return strnatcmp($a, $b);
            } else {
                return $authors[$b] - $authors[$a];
            }
        });
    }

    ?>
    <div style="border:2px solid #ccc; max-width:500px; height: 150px; overflow-y: scroll;padding:0.5rem;">
        <?php
        foreach ($authors as $author => $checked) {
            ?>
            <div style="width:100%;padding-bottom:0.5rem;">
                <label for="allow-list-checkbox-<?php echo esc_attr($author); ?>" style="">
                    <input type="checkbox" id="allow-list-checkbox-<?php echo esc_attr($author); ?>"
                        name="block_protocol_options[<?php echo esc_attr($args['label_for']); ?>][]"
                        value="<?php echo esc_attr($author); ?>" <?php checked($checked) ?> />
                    <b>@
                        <?php echo esc_html($author); ?>
                    </b>
                </label>
            </div>
            <?php
        }
        ?>
    </div>
    <?php
}

function block_protocol_section_plugin_usage_intro($args)
{
    ?>
    <p id="<?php echo esc_attr($args['id']); ?>">

    <p>
        Crash reports and aggregated telemetry help us improve the plugin.
    </p>
    <?php
}

function block_protocol_field_plugin_usage_renderer($args)
{
    $options = get_option('block_protocol_options');
    ?>
    <input id="<?php echo esc_attr($args['label_for']); ?>"
        name="block_protocol_options[<?php echo esc_attr($args['label_for']); ?>]" type="checkbox" <?php
           checked(($options[$args['label_for']] ?? 'off') == 'on') ?>>
    </input>
    <?php
}

/**
 * Add the top level menu page.
 */
function block_protocol_options_page()
{
    $icon_url = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHZpZXdCb3g9IjAgMCAyMCAyMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTExLjUzNDUgNC42SDguNTE4NTdWMy4wNTcxNEM4LjUxODU3IDIuNTExNTUgOC4zMDY3NCAxLjk4ODMxIDcuOTI5NjggMS42MDI1M0M3LjU1MjYyIDEuMjE2NzQgNy4wNDEyMSAxIDYuNTA3OTYgMUg1VjE2Ljk0MjlDNSAxNy40ODg0IDUuMjExODMgMTguMDExNyA1LjU4ODg5IDE4LjM5NzVDNS45NjU5NiAxOC43ODMzIDYuNDc3MzcgMTkgNy4wMTA2MSAxOUg4LjUxODU3VjE1LjRIMTEuNTM0NUMxMi44OTg4IDE1LjM0NzIgMTQuMTkgMTQuNzU1NiAxNS4xMzY5IDEzLjc0OTRDMTYuMDgzOSAxMi43NDMyIDE2LjYxMjkgMTEuNDAwNyAxNi42MTI5IDEwLjAwMzlDMTYuNjEyOSA4LjYwNzAyIDE2LjA4MzkgNy4yNjQ1MyAxNS4xMzY5IDYuMjU4MzJDMTQuMTkgNS4yNTIxMiAxMi44OTg4IDQuNjYwNSAxMS41MzQ1IDQuNjA3NzFWNC42Wk0xMS41MzQ1IDExLjhIOC41MTg1N1Y4LjJIMTEuNTM0NUMxMi41Mzk4IDguMiAxMy4yMzA5IDkuMDEzODYgMTMuMjMwOSAxMEMxMy4yMzA5IDEwLjk4NjEgMTIuNTM5OCAxMS43OTYxIDExLjUzNDUgMTEuNzk2MVYxMS44WiIgZmlsbD0iIzk1OUFBMCIvPgo8L3N2Zz4K';

    add_menu_page(
        'Block Protocol',
        'Block Protocol',
        'manage_options',
        'block_protocol',
        'block_protocol_options_page_html',
        $icon_url
    );
}


/**
 * Register our block_protocol_options_page to the admin_menu action hook.
 */
add_action('admin_menu', 'block_protocol_options_page');

function block_protocol_field_hidden_renderer($field)
{
    $options = get_option('block_protocol_options');
    ?>
    <input
            name="block_protocol_options[<?= esc_attr($field); ?>]"
            type="hidden"
            value="<?php echo isset($options[$field]) ? (esc_attr($options[$field])) : (''); ?>"></input>
    <?php
}

function block_protocol_options_page_settings_html()
{
    if (isset($_GET['activated']) && $_GET['activated'] === 'true') {
        ?>
        <div class="BPSettingsBanner">
            <p class="BPSettingsBannerInstructionsPara"><strong>Success!</strong> You now have access to <strong>Þ</strong> blocks on this website.</p>
            <div class="BPSettingsBannerInstructions">
                <h4 class="BPSettingsBannerInstructionsHeader">Instructions</h4>
                <ul>
                    <li>
                        <div class="BPSettingsBannerInstructionsBadge">1</div>
                        Head to a new post or page, and click the blue “Toggle block inserter” button in the top-left that looks like this
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" class="BPSettingsFa"><!--! Font Awesome Pro 6.4.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M438.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-160-160c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L338.8 224 32 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l306.7 0L233.4 393.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l160-160z"/></svg>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" class="BPSettingsBannerInstructionsInsert"><g fill="none" fill-rule="evenodd"><rect fill="#007CBA" width="32" height="32" rx="2"/><path fill="#FFF" d="M15 15h-5v2h5v5h2v-5h5v-2h-5v-5h-2z"/></g></svg>
                    </li>
                    <li>
                        <div class="BPSettingsBannerInstructionsBadge">2</div>
                        Under the “Blocks” tab, choose any block from the “Block Protocol” section
                    </li>
                </ul>
            </div>
        </div>
            <?php
    }

    ?>
    <form action="options.php" method="post" style="margin-top:30px;">
        <?php
        // output security fields for the registered setting "block_protocol"
        settings_fields('block_protocol');
        block_protocol_field_hidden_renderer('block_protocol_field_api_email');
        /**
         * This will display the full API key which has been saved as a hidden field. This is necessary
         * as the wordpress options.php will remove any missing fields. We don't want to be in a position
         * of outputting an API key, so we should find an alternative
         *
         * @todo find a way to avoid outputting the full API key
         * @see https://hashintel.slack.com/archives/C02LG39FJAU/p1680544602069229
         */
        block_protocol_field_hidden_renderer('block_protocol_field_api_key');
        block_protocol_field_hidden_renderer('block_protocol_field_api_email_verification_id');
        // output setting sections and their fields
        // (sections are registered for "block_protocol", each field is registered to a specific section)
        do_settings_sections('block_protocol');
        // output save settings button
        submit_button('Save Settings');
        ?>
    </form>
    <h2>Entities</h2>
    <p>The entities created and edited by Block Protocol blocks</p>
    <div style="max-height:800px;border:1px solid rgba(0,0,0,0.2);display:inline-block;">
        <table
                style="border-spacing:0;border-collapse:collapse;max-height:600px;overflow-y:scroll;display:inline-block;">
            <thead>
            <tr>
                <th
                        style="background: white; padding: 5px 15px;border: 1px solid rgba(0,0,0,0.2);top:0;position:sticky;top:-1px;">
                    Properties
                </th>
                <th
                        style="background: white; padding: 5px 15px;border: 1px solid rgba(0,0,0,0.2);top:0;position:sticky;">
                    Found in pages
                </th>
            </tr>
            </thead>
            <tbody>
            <?php
            $entities_with_locations = get_block_protocol_entities_and_locations();

            foreach ($entities_with_locations as $entity) {


                echo sprintf(
                    "
    <tr>
        <td style='max-width: 600px;background: #f6f7f7; padding: 5px 15px;border: 1px solid rgba(0,0,0,0.2);'><pre style='white-space:pre-wrap;word-break:break-word;'>%s</pre></td>
        <td style='background: #f6f7f7; padding: 5px 15px;border: 1px solid rgba(0,0,0,0.2);'>%s</td>
    </tr>",
                    esc_html(block_protocol_json_encode([
                        'entityId' => $entity['entity_id'],
                        'entityTypeId' => $entity['entity_type_id'],
                        'properties' => json_decode($entity['properties'])
                    ], JSON_PRETTY_PRINT)),
                    join(',', array_map(function ($location) {
                        return sprintf(
                            "<div><a href='%s'>%s</a><div>",
                            esc_url($location['edit_link']),
                            esc_html($location['title'])
                        );
                    }, $entity['locations']))
                );
            }
            ?>
            </tbody>
        </table>
    </div>
    <?php
}


/**
 * Top level menu callback function
 */
function block_protocol_options_page_html()
{
    // check user capabilities
    if (!current_user_can('manage_options')) {
        return;
    }

    $options = get_option('block_protocol_options');
    $api_key = $options ? $options['block_protocol_field_api_key'] : null;
    // add error/update messages

    // check if the user have submitted the settings
    // WordPress will add the "settings-updated" $_GET parameter to the url
    if (isset($_GET['settings-updated'])) {
        // add settings saved message with the class of "updated"
        add_settings_error('block_protocol_messages', 'block_protocol_message', __('Settings Saved', 'block_protocol'), 'updated');
    }

    // show error/update messages
    settings_errors('block_protocol_messages');

    ?>
    <div class="wrap">
        <h1>
            <?php echo esc_html(get_admin_page_title()); ?>
        </h1>
        <?php
        $api_key ? block_protocol_options_page_settings_html() : block_protocol_options_page_activate_html();
        ?>
    </div>
    <?php
}
