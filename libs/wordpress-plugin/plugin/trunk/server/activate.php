<?php
/**
 * Call the blockprotocol API to trigger a link-wordpress email
 *
 * @todo show notification to check email
 * @todo move to admin_post action
 * @todo replace with wp_remote_post
 * @todo check nonce
 */
function block_protocol_link_by_email()
{
    if (!isset($_POST["email"]) || !$_POST["email"]) {
        exit(wp_redirect(admin_url('admin.php?page=block_protocol')));
    }

    $email = $_POST["email"];
    $options = get_option('block_protocol_options');

    if (!$options) {
        exit(wp_redirect(admin_url('admin.php?page=block_protocol')));
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
        update_option("block_protocol_options", [
            'block_protocol_field_api_email' => $email,
            'block_protocol_field_api_email_verification_id' => $respJson["verificationCodeId"]
        ]);
        exit(wp_redirect(admin_url('admin.php?page=block_protocol')));
    } else {
        echo "Internal error";
        exit();
    }
}

add_action('admin_post_block_protocol_link_by_email', 'block_protocol_link_by_email');

function block_protocol_options_page_activate_html()
{
    $options = get_option("block_protocol_options");
    $email = $options["block_protocol_field_api_email"];
    ?>
    <form action="<?= admin_url('admin-post.php') ?>" method="POST">
        <input type="hidden" name="action" value="block_protocol_link_by_email">
        <input type="email" name="email"
               value="<?= isset($email) ? esc_attr($email) : '' ?>"/>
        <input type="submit"/>
    </form>
    <form action="options.php" method="POST">
        <?php settings_fields('block_protocol'); ?>
        <input id="block_protocol_field_api_key"
               name="block_protocol_options[block_protocol_field_api_key]"
               style="width: 620px; max-width: 100%;" type="password" value="">
        <?php submit_button('Save Settings'); ?>
    </form>
    <div id="blockprotocol-settings-react-promo"></div>
    <?php
}