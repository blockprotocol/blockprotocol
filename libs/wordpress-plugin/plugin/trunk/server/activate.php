<?php
/**
 * Call the blockprotocol API to trigger a link-wordpress email
 */
function block_protocol_link_by_email()
{
    check_admin_referer("block_protocol_link_by_email");

    $url = admin_url('admin.php?page=block_protocol');

    if (!isset($_POST["email"]) || !$_POST["email"]) {
        exit(wp_redirect($url));
    }

    $email = $_POST["email"];
    $options = get_option('block_protocol_options');

    if (!$options) {
        exit(wp_redirect($url));
    }

    $base = get_block_protocol_site_host();
    $url = "{$base}/api/link-wordpress";
    $headers = [
        'Accept' => 'application/json',
        'Content-Type' => 'application/json',
    ];
    $data = [
        'email' => $email,
        'wordpressInstanceUrl' => get_site_url()
    ];

    $respStr = wp_remote_post($url, [
        'method' => 'POST',
        'headers' => $headers,
        'body' => json_encode($data)
    ])["body"];

    $respJson = json_decode($respStr, true);

    if ($respJson["verificationCodeId"]) {
        update_option("block_protocol_options", [
            'block_protocol_field_api_email' => $email,
            'block_protocol_field_api_email_verification_id' => $respJson["verificationCodeId"]
        ]);
        exit(wp_redirect($url));
    }

    if (isset($respJson["errors"]) && isset($respJson["errors"][0]) && isset($respJson["errors"][0]["param"])) {
        $url .= "&" . http_build_query([
                "invalid_field" => $respJson["errors"][0]["param"],
                "invalid_field_value" => $respJson["errors"][0]["value"] ?? ""
            ]);
    } else {
        $url .= "&unknown_error=true";
    }

    exit(wp_redirect($url));
}

add_action('admin_post_block_protocol_link_by_email', 'block_protocol_link_by_email');

function block_protocol_activate_submit_button($label, $extra_html = "")
{
    ?>
    <button type="submit" name="submit"
            class="BPActivateButton" <?= $extra_html ?>>
        <?= $label ?>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"
             class="BPActivateButtonSvg">
            <!--! Font Awesome Pro 6.4.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. -->
            <path d="M438.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-160-160c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L338.8 224 32 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l306.7 0L233.4 393.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l160-160z"/>
        </svg>
    </button>
    <?php
}

function block_protocol_options_page_activate_html()
{
    $options = get_option("block_protocol_options");
    $passedEmailInvalid = $_GET["invalid_field"] === "email";
    $passedEmail = $passedEmailInvalid ? $_GET["invalid_field_value"] ?? "" : null;
    $email = $options["block_protocol_field_api_email"] ?? $passedEmail ?? "";
    $email_exists = !!$email;
    ?>
    <div class="BPActivate">
        <h2 class="BPActivateHeading" style="margin-bottom: 18px;">Finish
            activating
            the Block Protocol plugin</h2>
        <p style="margin-bottom:0;">
            Because the Block Protocol provides free credits and access to an
            array
            of external services such as OpenAI and Mapbox which ordinarily cost
            money, we need to verify your email address in order to continue.
        </p>
        <form action="<?= admin_url('admin-post.php') ?>" method="POST">
            <?php wp_nonce_field("block_protocol_link_by_email"); ?>
            <input type="hidden" name="action"
                   value="block_protocol_link_by_email">
            <p style="margin-top:28px;margin-bottom:8px;">
                <label for="block_protocol_field_email"><strong>Enter your email
                        address below.</strong> You will need to click a link to
                    confirm your authenticity.</label>
            </p>
            <input type="email" name="email" id="block_protocol_field_email"
                   value="<?= esc_attr($passedEmail ?? $email ?? "") ?>"
                <?= $email_exists ? "disabled" : "autofocus" ?>
            />
            <?php block_protocol_activate_submit_button("Continue with email", $email_exists ? 'disabled' : '') ?>
            <?php if ($passedEmailInvalid): ?>
                <p style="margin-top:8px;margin-bottom:0px;"
                   class="BPActivateError">
                    <span class="BPActivateErrorRed">Email address invalid.</span>
                    Please try entering it again.
                </p>
            <?php elseif ($email_exists): ?>
                <p style="margin-top:8px;margin-bottom:0px;">Check your
                    <strong><?= htmlentities($email) ?></strong> inbox.
                    Make a mistake? <a
                            href="<?= wp_nonce_url(admin_url('admin-post.php?action=block_protocol_remove_key'), "block_protocol_remove_key"); ?>">Click
                        here to enter another email address</a></p>
            <?php endif; ?>
        </form>
        <form action="options.php" method="POST">
            <?php settings_fields('block_protocol'); ?>
            <p style="margin-top:28px;margin-bottom:8px;">
                <label for="block_protocol_field_api_key"><strong>
                        <?php if ($email_exists): ?>
                            Now enter a Block Protocol (Þ) API key below:
                        <?php else: ?>
                            Alternatively, enter a Block Protocol (Þ) API key below.
                        <?php endif; ?>
                    </strong></label>
            </p>
            <input id="block_protocol_field_api_key"
                   name="block_protocol_options[block_protocol_field_api_key]"
                   type="password"
                   data-1p-ignore
                <?= $email_exists ? "autofocus" : "" ?>
            >
            <?php block_protocol_activate_submit_button("Continue with key") ?>
            <p style="margin-top:8px;margin-bottom:0;">
                Block Protocol users can access or create an API key at any time
                from
                <a href="<?= get_block_protocol_site_host() ?>/settings/api-keys"
                   target="_blank">blockprotocol.org/settings/api-keys</a>
            </p>
        </form>
    </div>
    <div id="blockprotocol-settings-react-promo"></div>
    <?php
}