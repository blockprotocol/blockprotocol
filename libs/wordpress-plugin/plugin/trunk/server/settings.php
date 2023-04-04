<?php
require_once __DIR__ . "/util.php";

/**
 * @internal never define functions inside callbacks.
 * these functions could be run multiple times; this would result in a fatal error.
 */


function block_protocol_settings_enqueue_scripts($hook) {
    if ($hook !== "toplevel_page_block_protocol") {
        return;
    }

    wp_enqueue_script('block_protocol_settings', plugins_url('../build/settings.js', __FILE__), ['react', 'react-dom'],
        BLOCK_PROTOCOL_PLUGIN_VERSION);
}

add_action("admin_enqueue_scripts", "block_protocol_settings_enqueue_scripts");

// @todo check nonce
function block_protocol_remove_key()
{
    $options = get_option('block_protocol_options');
    $next_options = array_merge($options, [
        "block_protocol_field_api_email" => "",
        "block_protocol_field_api_key" => "",
        "block_protocol_field_api_email_verification_id" => "",
    ]);
    update_option("block_protocol_options", $next_options);
    exit(wp_redirect( admin_url( 'admin.php?page=block_protocol' )));
}

add_action('admin_post_block_protocol_remove_key', 'block_protocol_remove_key');

/**
 * Call the blockprotocol API to trigger a link-wordpress email
 *
 * @todo show notification to check email
 * @todo move to admin_post action
 * @todo replace with wp_remote_post
 */
function block_protocol_api_do_link_wordpress()
{
    $options = get_option('block_protocol_options');

    if (!$options) {
        return;
    }

    $email = $options["block_protocol_field_api_email"];

    if ($options["block_protocol_field_api_key"] || !$email || $options["block_protocol_field_api_email_verification_id"]) {
        return;
    }

    $base = get_block_protocol_site_host();
    $url = "{$base}/api/link-wordpress";
    $curl = curl_init();
    curl_setopt($curl, CURLOPT_URL, $url);
    curl_setopt($curl, CURLOPT_POST, true);
    curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
    $headers = [
        'Accept: application/json',
        'Content-Type: application/json',
    ];
    curl_setopt($curl, CURLOPT_HTTPHEADER, $headers);
    $data = [
        'email' => $email,
        // @todo need to handle this on the other end
        'wordpressInstanceUrl' => get_site_url()
    ];
    $str = json_encode($data, JSON_PRETTY_PRINT);
    curl_setopt($curl, CURLOPT_POSTFIELDS, $str);
    $respStr = curl_exec($curl);
    curl_close($curl);
    $respJson = json_decode($respStr, true);

    // @todo handle output in this flow
    if ($respJson["verificationCodeId"]) {
        update_option("block_protocol_options", array_merge($options, [
            'block_protocol_field_api_email_verification_id' => $respJson["verificationCodeId"]
        ]));
        exit(wp_redirect( admin_url( 'admin.php?page=block_protocol' )));
    } else {
        echo "Internal error";
        exit();
    }
}

/**
 * custom option and settings
 */
function block_protocol_settings_init()
{
    block_protocol_api_do_link_wordpress();

    // Get the value of the setting we've registered with register_setting()
    $options = get_option('block_protocol_options');

    // Register a new setting for "block_protocol" page.
    register_setting('block_protocol', 'block_protocol_options', [
        'default' => [
            'block_protocol_field_api_email' => '',
            'block_protocol_field_api_email_verification_id' => '',
            'block_protocol_field_api_key' => '',
            'block_protocol_field_allow_unverified' => "off",
            'block_protocol_field_plugin_usage' => "on",
            'block_protocol_field_author_allow_list' => [],
        ],
    ]);


    // ------- Settings related to the BP API key --------- //
    add_settings_section(
        'block_protocol_section_api_account',
        __('blockprotocol.org Account', 'block_protocol'),
        'block_protocol_section_api_key_intro',
        'block_protocol'
    );

    if (!$options || !$options["block_protocol_field_api_key"]) {

        add_settings_field(
            'block_protocol_field_api_email',
            __('Email', 'block_protocol'),
            'block_protocol_field_api_email_renderer',
            'block_protocol',
            'block_protocol_section_api_account',
            [
                'label_for' => 'block_protocol_field_api_email',
                'class' => 'block_protocol_row',
            ]
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
    } else {
        // ------- Settings related to permitted blocks --------- //

        add_settings_field(
            'block_protocol_field_api_key',
            __('Key', 'block_protocol'),
            'block_protocol_field_api_key_exists_renderer',
            'block_protocol',
            'block_protocol_section_api_account',
            [
                'label_for' => 'block_protocol_field_api_key',
                'class' => 'block_protocol_row',
            ]
        );

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
}

/**
 * Register our block_protocol_settings_init to the admin_init action hook.
 */
add_action('admin_init', 'block_protocol_settings_init');


/**
 * Intro to the API key section
 *
 * @param array $args The settings array, defining title, id, callback.
 */
function block_protocol_section_api_key_intro($args)
{
    ?>
    <p id="<?php echo esc_attr($args['id']); ?>"> Generate your Block Protocol API key at <a
            href="https://blockprotocol.org/account/api"
            target="_blank">https://blockprotocol.org/account/api</a></p>
    <?php
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

function block_protocol_field_api_email_renderer($args)
{
    // Get the value of the setting we've registered with register_setting()
    $options = get_option('block_protocol_options');
    $value = $options ? $options[$args['label_for']] : null;
    $email_exists = !!$value;
    ?>
    <input
           name="block_protocol_options[<?php echo esc_attr($args['label_for']); ?>]"
           type="hidden"
           value="<?php echo $email_exists ? (esc_attr($value)) : (''); ?>" />
    <?php if ($email_exists): ?>
    <input
           name="block_protocol_options[block_protocol_field_api_email_verification_id]"
           type="hidden"
           value="<?php echo esc_attr($options["block_protocol_field_api_email_verification_id"]); ?>" />
    <input id="<?php echo esc_attr($args['label_for']); ?>"
           style="width: 620px; max-width: 100%;"
           type="email"
           <?= $email_exists ? "disabled" : "" ?>
           value="<?php echo $email_exists ? (esc_attr($value)) : (''); ?>" />
    <p>Email sent. Check your <strong><?= $value ?></strong> inbox. Make a mistake? <a href="<?= admin_url('admin-post.php?action=block_protocol_remove_key'); ?>">Click here to enter another email address</a></p>
<?php else: ?>
    <input  id="<?php echo esc_attr($args['label_for']); ?>"
            name="block_protocol_options[<?php echo esc_attr($args['label_for']); ?>]"
            style="width: 620px; max-width: 100%;"
            type="email"
            value="<?php echo $email_exists ? (esc_attr($value)) : (''); ?>" />
<?php endif;
}

function block_protocol_field_api_key_renderer($args)
{
    // Get the value of the setting we've registered with register_setting()
    $options = get_option('block_protocol_options');
    ?>
    <input id="<?php echo esc_attr($args['label_for']); ?>"
        name="block_protocol_options[<?php echo esc_attr($args['label_for']); ?>]" style="width: 620px; max-width: 100%;"
        type="password"
        value="<?php echo isset($options[$args['label_for']]) ? (esc_attr($options[$args['label_for']])) : (''); ?>"></input>
    <?php
}


function block_protocol_field_api_key_exists_renderer($args)
{
    // Get the value of the setting we've registered with register_setting()
    $options = get_option('block_protocol_options');
    $apiKey = $options[$args['label_for']];
    $public = explode(".", $apiKey)[1];

    ?>
        <input type="hidden" name="block_protocol_options[block_protocol_field_api_email]" value="<?= esc_attr($options["block_protocol_field_api_email"]) ?>" />
        <p>This WordPress instance is linked to <strong><?= htmlentities($options["block_protocol_field_api_email"]); ?></strong> Block Protocol account. The public portion of the API key linked to this account is shown below.</p>
    <?php
    // @todo don't do this – see https://hashintel.slack.com/archives/C02LG39FJAU/p1680544602069229
    ?>
    <input
           name="block_protocol_options[<?php echo esc_attr($args['label_for']); ?>]"
           type="hidden"
           value="<?= esc_attr($apiKey); ?>" />
    <input id="<?php echo esc_attr($args['label_for']); ?>"
           type="text"
           style="width: 620px; max-width: 100%;"
           disabled
           value="<?= esc_attr($public); ?>" />
    <br />
    <a href="<?= admin_url('admin-post.php?action=block_protocol_remove_key') ?>">Detach keys from this website</a> | <a target="_blank" rel="noopener noreferrer" href="<?=get_block_protocol_site_host()?>/account/api">Manage or create API keys</a>
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
           checked(($options[$args['label_for']] ?? "off") == "on") ?>>
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
           checked(($options[$args['label_for']] ?? "off") == "on") ?>>
    </input>
    <?php
}

/**
 * Add the top level menu page.
 */
function block_protocol_options_page()
{
    $icon_url = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHZpZXdCb3g9IjAgMCAyMCAyMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTExLjUzNDUgNC42SDguNTE4NTdWMy4wNTcxNEM4LjUxODU3IDIuNTExNTUgOC4zMDY3NCAxLjk4ODMxIDcuOTI5NjggMS42MDI1M0M3LjU1MjYyIDEuMjE2NzQgNy4wNDEyMSAxIDYuNTA3OTYgMUg1VjE2Ljk0MjlDNSAxNy40ODg0IDUuMjExODMgMTguMDExNyA1LjU4ODg5IDE4LjM5NzVDNS45NjU5NiAxOC43ODMzIDYuNDc3MzcgMTkgNy4wMTA2MSAxOUg4LjUxODU3VjE1LjRIMTEuNTM0NUMxMi44OTg4IDE1LjM0NzIgMTQuMTkgMTQuNzU1NiAxNS4xMzY5IDEzLjc0OTRDMTYuMDgzOSAxMi43NDMyIDE2LjYxMjkgMTEuNDAwNyAxNi42MTI5IDEwLjAwMzlDMTYuNjEyOSA4LjYwNzAyIDE2LjA4MzkgNy4yNjQ1MyAxNS4xMzY5IDYuMjU4MzJDMTQuMTkgNS4yNTIxMiAxMi44OTg4IDQuNjYwNSAxMS41MzQ1IDQuNjA3NzFWNC42Wk0xMS41MzQ1IDExLjhIOC41MTg1N1Y4LjJIMTEuNTM0NUMxMi41Mzk4IDguMiAxMy4yMzA5IDkuMDEzODYgMTMuMjMwOSAxMEMxMy4yMzA5IDEwLjk4NjEgMTIuNTM5OCAxMS43OTYxIDExLjUzNDUgMTEuNzk2MVYxMS44WiIgZmlsbD0iIzk1OUFBMCIvPgo8L3N2Zz4K";

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

/**
 * Top level menu callback function
 */
function block_protocol_options_page_html()
{
    // check user capabilities
    if (!current_user_can('manage_options')) {
        return;
    }

    $options = get_option("block_protocol_options");
    $apiKey = $options ? $options["block_protocol_field_api_key"] : null;

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
        <form action="options.php" method="post" style="margin-top:30px;">
            <?php
            // output security fields for the registered setting "block_protocol"
            settings_fields('block_protocol');
            // output setting sections and their fields
            // (sections are registered for "block_protocol", each field is registered to a specific section)
            do_settings_sections('block_protocol');
            // output save settings button
            // @todo do input specific buttons
//            if (!$apiKey) {
                submit_button('Save Settings');
//            }
            ?>
        </form>
        <?php if ($apiKey): ?>
            <h2>Entities</h2>
            <p>The entities created and edited by Block Protocol blocks</p>
            <div style="max-height:800px;border:1px solid rgba(0,0,0,0.2);display:inline-block;">
                <table
                    style="border-spacing:0;border-collapse:collapse;max-height:600px;overflow-y:scroll;display:inline-block;">
                    <thead>
                        <tr>
                            <th
                                style="background: white; padding: 5px 15px;border: 1px solid rgba(0,0,0,0.2);top:0;position:sticky;top:-1px;">
                                Properties</th>
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
                                    "entityId" => $entity["entity_id"],
                                    "entityTypeId" => $entity["entity_type_id"],
                                    "properties" => json_decode($entity["properties"])
                                ], JSON_PRETTY_PRINT)),
                                join(",", array_map(function ($location) {
                                    return sprintf(
                                        "<div><a href='%s'>%s</a><div>",
                                        esc_url($location["edit_link"]),
                                        esc_html($location["title"])
                                    );
                                }, $entity["locations"]))
                            );
                        }
                        ?>
                    </tbody>
                </table>
            <?php else: ?>
                <div id="blockprotocol-settings-react-promo"></div>
            <?php endif; ?>
        </div>
    </div>
    <?php
}
