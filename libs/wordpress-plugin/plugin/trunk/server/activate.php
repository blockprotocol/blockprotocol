<?php
/**
 * Call the blockprotocol API to trigger a link-wordpress email
 */
function block_protocol_link_by_email()
{
    check_admin_referer('block_protocol_link_by_email');

    $url = admin_url('admin.php?page=block_protocol');

    if (!isset($_POST['email']) || !$_POST['email']) {
        exit(wp_redirect($url));
    }

    $email = $_POST['email'];
    $base = get_block_protocol_site_host();
    $api_url = "{$base}/api/link-wordpress";
    $headers = [
        'Accept' => 'application/json',
        'Content-Type' => 'application/json',
    ];
    $data = [
        'email' => $email,
        'wordpressInstanceUrl' => get_site_url(),
        'wordpressSettingsUrl' => $url,
    ];

    $resp_str = wp_remote_post($api_url, [
        'method' => 'POST',
        'headers' => $headers,
        'body' => json_encode($data)
    ])['body'];

    $resp_json = json_decode($resp_str, true);

    if (isset($resp_json['verificationCodeId'])) {
        block_protocol_update_options([
            'block_protocol_field_api_email' => $email,
            'block_protocol_field_api_email_verification_id' => $resp_json['verificationCodeId'],
            'block_protocol_field_api_key' => ''
        ]);
    } else if (isset($resp_json['errors']) && isset($resp_json['errors'][0]) && isset($resp_json['errors'][0]['param'])) {
        $url .= '&' . http_build_query([
                'invalid_field' => $resp_json['errors'][0]['param'],
                'invalid_field_value' => $resp_json['errors'][0]['value'] ?? ''
            ]);
    } else {
        $url .= '&unknown_error=true';
    }

    exit(wp_redirect($url));
}

add_action('admin_post_block_protocol_link_by_email', 'block_protocol_link_by_email');

function block_protocol_link_by_api_key()
{
    check_admin_referer('block_protocol_link_by_api_key');

    $url = admin_url('admin.php?page=block_protocol');

    if (isset($_POST['key']) && $_POST['key']) {
        $key = $_POST['key'];

        block_protocol_update_options([
            'block_protocol_field_api_key' => $key
        ]);
        $url .= '&activated=true';
    }

    exit(wp_redirect($url));
}

add_action('admin_post_block_protocol_link_by_api_key', 'block_protocol_link_by_api_key');

function block_protocol_activate_submit_button($label, $extra_html = '', $icon = 'arrow')
{
    $icons = [
        'arrow' => '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" class="BPSettingsFa BPSettingsButtonSvg"><path d="M438.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-160-160c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L338.8 224 32 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l306.7 0L233.4 393.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l160-160z"/></svg>',
        'tick' => '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" class="BPSettingsFa BPSettingsButtonSvg"><path d="M438.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 338.7 393.4 105.4c12.5-12.5 32.8-12.5 45.3 0z"/></svg>'
    ];

    ?>
    <button type="submit" name="submit"
            class="BPSettingsButton" <?= $extra_html ?>>
        <?= $label ?>
        <?= $icons[$icon]; ?>
    </button>
    <?php
}

function block_protocol_options_page_activate_html()
{
    $options = get_option('block_protocol_options');
    $input_invalid = isset($_GET['invalid_field']);
    $passed_email_invalid = $input_invalid && $_GET['invalid_field'] === 'email';
    $passed_email = $passed_email_invalid ? $_GET['invalid_field_value'] ?? '' : null;
    $email = $options['block_protocol_field_api_email'] ?? $passed_email ?? '';
    $email_exists = !!$email;
    ?>
    <div class="BPActivate">
        <div class="BPSettingsBanner">
            <h3 class="BPSettingsBannerHeading">
                <svg class="BPSettingsFa" xmlns="http://www.w3.org/2000/svg"
                     viewBox="0 0 512 512">
                    <path d="M506.3 417l-213.3-364C284.8 39 270.4 32 256 32C241.6 32 227.2 39 218.1 53l-213.2 364C-10.59 444.9 9.851 480 42.74 480h426.6C502.1 480 522.6 445 506.3 417zM52.58 432L255.1 84.8L459.4 432H52.58zM256 337.1c-17.36 0-31.44 14.08-31.44 31.44c0 17.36 14.11 31.44 31.48 31.44s31.4-14.08 31.4-31.44C287.4 351.2 273.4 337.1 256 337.1zM232 184v96C232 293.3 242.8 304 256 304s24-10.75 24-24v-96C280 170.8 269.3 160 256 160S232 170.8 232 184z"/>
                </svg>
                Almost there...
            </h3>
            <p>
                Unlock <strong>Þ</strong> blocks for use by completing the final
                remaining step below.
            </p>
        </div>

        <h2 class="BPActivateHeading" style="margin-bottom: 18px;">
            <?= __('Finish activating the Block Protocol plugin', 'block_protocol'); ?>
        </h2>
        <p class="BPActivatePara" style="margin-bottom:0;">
            <?= __('Because the Block Protocol provides free credits and access to an array of external services such as OpenAI and Mapbox which ordinarily cost money, we need to verify your email address in order to continue.', 'block_protocol'); ?>
        </p>
        <form action="<?= admin_url('admin-post.php') ?>" method="POST">
            <?php wp_nonce_field('block_protocol_link_by_email'); ?>
            <input type="hidden" name="action"
                   value="block_protocol_link_by_email">
            <p class="BPActivatePara"
               style="margin-top:28px;margin-bottom:8px;">
                <label for="block_protocol_field_email"><strong><?= __('Enter your email address below.', 'block_protocol'); ?></strong> <?= __('You will need to click a link to confirm your authenticity.', 'block_protocol'); ?>
                </label>
            </p>
            <input type="email" name="email" id="block_protocol_field_email"
                   placeholder="e.g. name@example.com"
                   class="BPSettingsInput"
                   value="<?= esc_attr($passed_email ?? $email ?? '') ?>"
                <?= $email_exists ? 'disabled' : 'autofocus' ?>
            />
            <?php block_protocol_activate_submit_button(__($email_exists ? 'Email sent' : 'Continue with email', 'block-protocol'), $email_exists ? 'disabled' : '', 'tick') ?>
            <?php if ($input_invalid): ?>
                <p class="BPActivatePara BPActivateError"
                   style="margin-top:8px;margin-bottom:0px;">
                    <?php if ($passed_email_invalid): ?>
                        <span class="BPActivateErrorRed"><?= __('Email address invalid.', 'block_protocol'); ?></span>
                        <?= __('Please try entering it again.', 'block_protocol'); ?>
                    <?php else: ?>
                        <span class="BPActivateErrorRed"><?= __('Unknown error.', 'block_protocol'); ?></span>
                        <span style="text-transform: none; font-weight: normal"><?= sprintf(__('Value of %s invalid for %s field.', 'block_protocol'), '<span style="font-family: monospace">' . htmlentities($_GET['invalid_field_value']) . '</span>', '<span style="font-family: monospace">' . htmlentities($_GET['invalid_field']) . '</span>'); ?></span>
                    <?php endif; ?>
                </p>
            <?php elseif ($email_exists): ?>
                <p class="BPActivatePara"
                   style="margin-top:8px;margin-bottom:0px;">
                    <?= sprintf(__('Check your %s inbox. Make a mistake?', 'block_protocol'), '<strong>' . htmlentities($email) . '</strong>'); ?>
                    <a href="<?= wp_nonce_url(admin_url('admin-post.php?action=block_protocol_remove_key'), 'block_protocol_remove_key'); ?>">
                        <?= __('Click here to enter another email address', 'block_protocol'); ?>
                    </a>
                </p>
            <?php endif; ?>
        </form>
        <form action="<?= admin_url('admin-post.php') ?>" method="POST">
            <?php wp_nonce_field('block_protocol_link_by_api_key'); ?>
            <input type="hidden" name="action"
                   value="block_protocol_link_by_api_key">
            <p class="BPActivatePara"
               style="margin-top:28px;margin-bottom:8px;">
                <label for="block_protocol_field_api_key"><strong>
                        <?php if ($email_exists): ?>
                            <?= __('Now enter a Block Protocol (Þ) API key below:', 'block_protocol'); ?>
                        <?php else: ?>
                            <?= __('Alternatively, enter a Block Protocol (Þ) API key below.', 'block_protocol'); ?>
                        <?php endif; ?>
                    </strong></label>
            </p>
            <input class="BPSettingsInput" id="block_protocol_field_api_key"
                   name="key"
                   type="password"
                   data-1p-ignore
                   placeholder="e.g. b10ck5.9faa5da6664f7229999439d5433d4ac2.c549e92..."
                <?= $email_exists ? 'autofocus' : '' ?>
            >
            <?php block_protocol_activate_submit_button(__('Continue with key', 'block_protocol')) ?>
            <p class="BPActivatePara" style="margin-top:8px;margin-bottom:0;">
                <?= sprintf(__('Block Protocol users can access or create an API key at any time from %s', 'block_protocol'), "<a href='" . get_block_protocol_site_host() . "/account/api'>blockprotocol.org/account/api</a>"); ?>
            </p>
        </form>
    </div>
    <div id="blockprotocol-settings-react-promo"></div>
    <?php
}
