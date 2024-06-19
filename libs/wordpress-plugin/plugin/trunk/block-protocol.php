<?php
/**
 * @package blockprotocol
 * @version 0.0.9
 */
/*
Plugin Name: Block Protocol
Plugin URI: https://blockprotocol.org/wordpress
Description: Access an open, growing ecosystem of high-quality and powerful blocks via the Block Protocol.
Author: Block Protocol
Author URI: https://blockprotocol.org/?utm_medium=organic&utm_source=wordpress_plugin-directory_blockprotocol-plugin_author-name
Version: 0.0.9
Requires at least: 5.6.0
Tested up to: 6.2
License: AGPL-3.0
License URI: https://www.gnu.org/licenses/agpl-3.0.en.html
*/

const BLOCK_PROTOCOL_PLUGIN_VERSION = "0.0.9";

if (is_readable(__DIR__ . '/vendor/autoload.php')) {
	require __DIR__ . '/vendor/autoload.php';
}

require_once __DIR__ . "/server/data.php";
add_action('init', 'block_protocol_sentry_init');

require_once __DIR__ . "/server/settings.php";
require_once __DIR__ . "/server/block-db-table.php";
require_once __DIR__ . "/server/query.php";
require_once __DIR__ . "/server/block-api-endpoints.php";
require_once __DIR__ . "/server/util.php";

// str_starts_with introduces a minimum WP version of 5.9.0 - we can avoid it by using this instead
function block_protocol_starts_with($haystack, $needle)
{
	return substr_compare($haystack, $needle, 0, strlen($needle)) === 0;
}

function get_block_protocol_site_host()
{
	$site_host = getenv("BLOCK_PROTOCOL_SITE_HOST") ?: "https://blockprotocol.org";

	// enable connecting to a locally-running API in development
	$rewritten_host = str_replace("http://localhost", "http://host.docker.internal", $site_host);

	return $rewritten_host;
}

function is_block_protocol_block_permitted($block)
{
	$options = get_option('block_protocol_options');

	// Check block compatibility with protocol version(s) the plugin supports
	$block_version = $block["protocol"] ?? null;

	if (!isset($block_version) || (isset($block_version) && !block_protocol_starts_with($block_version, "0.3"))) {
		return false;
	}


	// Check block verification status against site preference
	if (!isset($options["block_protocol_field_allow_unverified"]) || $options["block_protocol_field_allow_unverified"] !== "on") {
		$verified = isset($block["verified"]) && $block["verified"];

		$author_allow_list = $options['block_protocol_field_author_allow_list'] ?? [];
		$block_author = $block['author'] ?? null;

		// Filter blocks that are not verified and whose authors are not in the allow list
		if (!$verified && !in_array($block_author, $author_allow_list)) {
			return false;
		}
	}

	return true;
}


// Get blocks from the Block Protocol API
function get_block_protocol_blocks()
{
	$options = get_option('block_protocol_options');

	$return = [];

	if (!isset($options['block_protocol_field_api_key']) || strlen($options['block_protocol_field_api_key']) < 1) {
		$return['errors'][0] = [];
        $return['errors'][0]['code'] = 'MISSING_API_KEY';
		$return['errors'][0]['msg'] = 'You need to set an API key in order to use the plugin – select Block Protocol from the left sidebar';
		return $return;
	}

	$api_key = $options['block_protocol_field_api_key'];
	$api_args = [
		'headers' => [
			'Content-Type' => 'application/json',
			'X-Api-Key' => $api_key,
			'Origin' => get_site_url(),
		]
	];

	$site_host = get_block_protocol_site_host();

	$block_response = wp_remote_get($site_host . "/api/blocks", $api_args);

	if (is_wp_error($block_response)) {
		$return['errors'][0] = [];
		$return['errors'][0]['msg'] = 'Error connecting to Block Protocol API – please try again in a minute.';
		block_protocol_maybe_capture_error("BP API error " . json_encode($block_response, JSON_PRETTY_PRINT));
		return $return;
	}

	$body = json_decode($block_response['body'], true);

	if (isset($body['errors'])) {
		return $body;
	}

	if (!isset($body['results'])) {
    $return['errors'][0] = [];
    $return['errors'][0]['msg'] = 'Error connecting to the API – please try again in a minute.';
    block_protocol_maybe_capture_error("BP API error " . json_encode($block_response, JSON_PRETTY_PRINT));
    return $return;
  }

	$blocks = $body['results'];

	$filtered_blocks = array_filter($blocks, function ($block) {
		return is_block_protocol_block_permitted($block);
	});

	// The array_filter will use the keys from the original array
	// we reindex the array by calling `array_values`
	return array_values($filtered_blocks);
}

$is_block_protocol_admin = $pagenow == 'admin.php' && ('block_protocol' === $_GET['page']);

// Test connection to the BP API and show a message with status if any error
function check_block_protocol_connection()
{
    global $is_block_protocol_admin;
	$response = get_block_protocol_blocks();

	if (isset($response['errors'])) {
		$errors = $response['errors'];
		$error = $errors[0];
		$message = $error['msg'];

        if ($error['code'] === "MISSING_API_KEY" && $is_block_protocol_admin) {
            return;
        }

		?>
		<div class="notice notice-error is-dismissible">
			<p style="margin-bottom:0;">Block Protocol:
				<?php echo (esc_html($message)) ?>
				<a href="https://blockprotocol.org/contact" style="margin-left:10px;">Get Help</a>
			<p>
		</div>
	<?php
	}
}

function block_protocol_database_unsupported()
{
	$supported = block_protocol_is_database_supported();

	if (!$supported) {
		?>
		<div class="notice notice-error is-dismissible">
			<p>Block Protocol:
				<?php 
				
				echo (esc_html(
					"The database you are using is not supported by the plugin. Please use MySQL "
					. BLOCK_PROTOCOL_MINIMUM_MYSQL_VERSION 
					. "+ or MariaDB "
					. BLOCK_PROTOCOL_MINIMUM_MARIADB_VERSION 
					. "+"));
				?>
			<p>
		</div>
	<?php
	}
}

global $pagenow;
if ($pagenow == 'index.php' || $pagenow == 'plugins.php' || ($is_block_protocol_admin)) {
    add_action('admin_notices', 'check_block_protocol_connection');
	add_action('admin_notices', 'block_protocol_database_unsupported');
}

/*
 * This is the function that's called whenever a page is rendered 
 * It should return the HTML that represents the block on the page
 */
function block_dynamic_render_callback($block_attributes)
{
	$entity_id = $block_attributes['entityId'];

	// if serving the Block Hub and WP server locally, allow the WP server running inside Docker to reach it
	$source_url = str_replace("http://localhost", "http://host.docker.internal", $block_attributes["sourceUrl"]);

	$block_name = $block_attributes["blockName"];

	return sprintf(
		'<div class="block-protocol-block" data-source="%s" data-entity="%s" data-block_name="%s"></div>',
		esc_attr($source_url),
		esc_attr($entity_id),
		esc_attr($block_name)
	);
}

// Add the block category for our block
function block_protocol_init()
{
	// DB is unsupported - bail
  if (!block_protocol_is_database_supported()) {
    return;
  }

	$response = get_block_protocol_blocks();
	if (isset($response['errors'])) {
		// user needs to set a valid API key – bail
		return;
	}
  
	// add the block category
	add_filter('block_categories_all', function ($categories) {
		return array_merge(
			[
				[
					'slug' => 'blockprotocol',
					'title' => 'Block Protocol',
				]
			],
			$categories
		);
	});

	if (!WP_Block_Type_Registry::get_instance()->is_registered('blockprotocol/block')) {
		register_block_type(
			"blockprotocol/block",
			[
				'render_callback' => 'block_dynamic_render_callback',
			]
		);
	}
}

add_action('admin_init', 'block_protocol_init');

// Register editor-only assets
// 1. register the editor script + dependencies
// 2. contact the BP API and fetch BP blocks
//    - enqueue block data for adding to the frontend
// 3. enqueue script that registers each BP block as a variation of the plugin block
function block_protocol_editor_assets() {
	// DB is unsupported - bail
  if (!block_protocol_is_database_supported()) {
    return;
  }

	$response = get_block_protocol_blocks();
	if (isset($response['errors'])) {
		// user needs to set a valid API key – bail
		return;
	}

	// Register and enqueue the sentry plugin if plugin analytics are enabled
	// We want to ensure errors are caught early, so we enqueue this first.
	if (!block_protocol_reporting_disabled()) {
		wp_register_script(
			'blockprotocol-sentry',
			plugins_url('build/sentry.js', __FILE__),
			[],
			BLOCK_PROTOCOL_PLUGIN_VERSION
		);
		wp_add_inline_script(
			'blockprotocol-sentry',
			"block_protocol_sentry_config = " . json_encode(block_protocol_client_sentry_init_args()),
			$position = 'before'
		);
		wp_enqueue_script('blockprotocol-sentry');
	}
  
	// this file has a list of the dependencies our FE block code uses, so we can include those too
	$asset_file = include(plugin_dir_path(__FILE__) . 'build/index.asset.php');

	// register and enqueue the main block script
	wp_register_script(
		'blockprotocol-script',
		plugins_url('build/index.js', __FILE__),
		$asset_file['dependencies'],
		$asset_file['version']
	);
	wp_enqueue_script('blockprotocol-script');

	// build data and send to the frontend so that we have this data available in the editing view
	$blocks = get_block_protocol_blocks();
	$data = [];
	$data['blocks'] = $blocks;
	$data['plugin_url'] = plugin_dir_url(__FILE__);
	$data['entities'] = get_block_protocol_entities_and_locations();
	wp_add_inline_script('blockprotocol-script', "block_protocol_data = " . json_encode($data));

	// register and enqueue the script that registers a variation of our block for each BP block available
	$variations_asset_file = include(plugin_dir_path(__FILE__) . 'build/register-variations.asset.php');
	wp_register_script(
		'blockprotocol-register-variations',
		plugins_url('build/register-variations.js', __FILE__),
		$variations_asset_file['dependencies'],
		$variations_asset_file['version']
	);
	wp_enqueue_script('blockprotocol-register-variations');
}

add_action('enqueue_block_editor_assets', 'block_protocol_editor_assets');

// End-user / rendered page setup for the plugin
// 1. Register the block type
// 2. Include the rendering script
// Relies on the post being available, and is run on 'the_post' hook
// Note that the $post is passed by reference – don't mutate it unless you mean to
function block_protocol_non_admin_post_scripts($post)
{
	if (!WP_Block_Type_Registry::get_instance()->is_registered('blockprotocol/block')) {
		register_block_type(
			"blockprotocol/block",
			[
				'render_callback' => 'block_dynamic_render_callback',
			]
		);
	}

	$render_asset_file = include(plugin_dir_path(__FILE__) . 'build/render.asset.php');

	wp_register_script(
		'blockprotocol-render-script',
		plugins_url('build/render.js', __FILE__),
		$render_asset_file['dependencies'],
		$render_asset_file['version']
	);
	wp_enqueue_script('blockprotocol-render-script');

	if (has_blocks($post->post_content)) {
		$blocks = parse_blocks($post->post_content);

		$entities = [];
		$source_files = [];

		foreach ($blocks as $block) {

			if ($block["blockName"] === "blockprotocol/block") {
				global $wpdb;

				$entity_id = $block["attrs"]["entityId"];

				// if serving the Block Hub and WP server locally, allow the WP server running inside Docker to reach it
				$source_url = str_replace("http://localhost", "http://host.docker.internal", $block["attrs"]["sourceUrl"]);

				// @todo optimization to speed up render time:
				//   instead of individual db requests, collect the entity ids and make a single trip to the db after this loop
				if (!isset($entities[$entity_id])) {
					$entity_subgraph = get_block_protocol_subgraph(
						$wpdb->prepare("WHERE entity_id = %s", $entity_id),
						2,
						0,
						0,
						2
					);
					$entities[$entity_id] = $entity_subgraph;
				}

				block_protocol_debounced_view_data();

				// @todo optimization to speed up render time:
				//   instead of making these requests sequentially, collect the source urls from each block
				//   and then make requests for all of them in parallel after this loop. @see curl_multi_exec or guzzle
				if (!isset($source_files[$source_url])) {
					$get_args = [
						'headers' => [
							'Origin' => get_site_url(),
						]
					];
					$sourceResponse = wp_remote_get($source_url, $get_args);
					$source = wp_remote_retrieve_body($sourceResponse);
					$source_files[$source_url] = $source;
				}
			}
		}

		wp_add_inline_script(
			'blockprotocol-render-script',
			"block_protocol_block_data=" . json_encode([
				"entities" => $entities,
				"sourceStrings" => $source_files
			])
		);
	}
}

if (!is_admin()) {
	add_action('the_post', 'block_protocol_non_admin_post_scripts');
}

$block_protocol_plugin_name = plugin_basename(__FILE__);
function block_protocol_add_settings_link($links)
{
	$url = esc_url(
		add_query_arg(
			'page',
			'block_protocol',
			get_admin_url() . 'admin.php'
		)
	);
	$settings_link = "<a href='$url'>" . __('Settings') . '</a>';

	array_push($links, $settings_link);
	return $links;
}
add_filter("plugin_action_links_$block_protocol_plugin_name", 'block_protocol_add_settings_link');

/**
 * Plugin activation hook.
 */
function block_protocol_plugin_activate()
{
	if(!is_numeric(get_option('block_protocol_view_count'))){
		add_option('block_protocol_view_count', 0);
	}

	block_protocol_page_data(
		'activated',
		array_merge(
			block_protocol_report_version_info(),
			['userCount' => count_users()['total_users']]
		)
	);
}
register_activation_hook(__FILE__, 'block_protocol_plugin_activate');


/**
 * Plugin deactivation hook.
 */
function block_protocol_plugin_deactivate()
{
	block_protocol_page_data(
		'deactivated', 
		array_merge(
			block_protocol_report_version_info(),
			['userCount' => count_users()['total_users']]
		)
	);

	if(block_protocol_database_available()) {
		block_protocol_debounced_view_data(true);
	}
}
register_deactivation_hook(__FILE__, 'block_protocol_plugin_deactivate');
