<?php

const DATA_URL = 'https://data.blockprotocol.org/v1/batch';
const PUBLIC_AUTH_HEADER = 'Basic MkxFRkhRODk3TWdRcG4zMFZwelZjaHRxNXdJOg==';

const SENTRY_DSN = "https://949242e663cf415c8c1a6a928ae18daa@o146262.ingest.sentry.io/4504758458122240";

function block_protocol_reporting_disabled()
{
  $option = get_option('block_protocol_options')['block_protocol_field_plugin_usage'] ?? "off";
  return $option !== "on";
}

function block_protocol_anonymous_user_id()
{
  $site_url = get_site_url();
  $user_login = wp_get_current_user()->user_login;
  return hash('md5', $user_login . $site_url);
}

function block_protocol_report_version_info()
{
  global $wp_version;
  global $wpdb;

  return [
    "wpVersion" => $wp_version,
    "dbServerInfo" => $wpdb->db_server_info(),
    "phpVersion" => phpversion(),
  ];
}

function block_protocol_public_id()
{
  $api_key = get_option('block_protocol_options')["block_protocol_field_api_key"] ?? "";

  if ($api_key == "") {
    return "";
  }

  $split_point = '.';

  $stringpos = strrpos($api_key, $split_point, -1);
  return substr($api_key, 0, $stringpos);
}

function block_protocol_aggregate_numbers()
{

  $entity_count = count_block_protocol_entities() ?: 0;
  $migration_version = (int) get_site_option('block_protocol_db_migration_version');

  return [
    'entityCount' => (int) $entity_count,
    'migrationVersion' => $migration_version,
  ];
}

function block_protocol_debounced_view_data(bool $skip_check = false)
{
  $view_count = get_option('block_protocol_view_count');
  if (!$skip_check) {
    update_option('block_protocol_view_count', $view_count + 1);
  }

  if ($skip_check || $view_count % 100 == 0) {
    block_protocol_page_data("viewed", array_merge(block_protocol_aggregate_numbers(), [
      'viewCount' => (int) $view_count,
    ]));
  }
}

function block_protocol_page_data(string $event, array $data)
{
  if (block_protocol_reporting_disabled()) {
    return;
  }

  // Ensure we're dealing with an associative array
  if (array_keys($data) === range(0, count($data) - 1)) {
    return false;
  }

  $public_id = block_protocol_public_id();

  $data['keyPublicId'] = $public_id;
  $data['origin'] = get_site_url();
  $data['wpTimestamp'] = gmdate("Y-m-d\TH:i:s\Z");

  $payload = [
    'userId' => block_protocol_anonymous_user_id(),
    'event' => $event,
    'type' => 'track',
    'properties' => $data,
  ];

  wp_remote_post(DATA_URL, [
    'blocking' => false,
    'method' => 'POST',
    'body' => json_encode(['batch' => [$payload]]),
    'headers' => [
      'Content-Type' => 'application/json',
      'Authorization' => PUBLIC_AUTH_HEADER,
    ]
  ]);
}

function block_protocol_maybe_capture_error($last_error)
{
  if(!function_exists('\Sentry\captureMessage')) { return; }

  if ($last_error) {
    \Sentry\captureMessage("Database error: " . $last_error);
  }
}

function block_protocol_filter_sentry_event($event)
{
  if(block_protocol_reporting_disabled()) {
    return null;
  }

  $exceptions = $event->getExceptions();

  // No exceptions in the event? Send the event to Sentry, it's most likely a log message
  if (empty($exceptions)) {
    return $event;
  }

  $stacktrace = $exceptions[0]->getStacktrace();

  // No stacktrace in the first exception? Send it to Sentry just to be safe then
  if ($stacktrace === null) {
    return $event;
  }

  // Little helper and fallback for PHP versions without the str_contains function
  $strContainsHelper = function ($haystack, $needle) {
    if (function_exists('str_contains')) {
      return str_contains( $haystack, $needle );
    }

    return $needle !== '' && mb_strpos($haystack, $needle) !== false;
  };

  foreach ($stacktrace->getFrames() as $frame) {
    // Check the the frame happened inside our plugin
    if ($strContainsHelper($frame->getFile(), 'plugins/blockprotocol')) {
      // Send the event to Sentry
      return $event;
    }
  }

  // Stacktrace contained no frames in our theme and/or plugin? We send nothing to Sentry
  return null;
}

function block_protocol_sentry_init()
{
  if(!function_exists('\Sentry\init')) { return; }

  $server_url = get_site_url();
  $environment = substr($server_url, 0, 16) == "http://localhost" ? "development" : "production";

  $sentry_init_args = [	
    'dsn' => SENTRY_DSN,	
    'environment' => $environment,
    'server_name' => $server_url,
    'release' => BLOCK_PROTOCOL_PLUGIN_VERISON,
    'sample_rate' => 1,
    'error_types' => E_ALL & ~E_DEPRECATED & ~E_NOTICE & ~E_USER_DEPRECATED,	
    'attach_stacktrace' => TRUE,
    'before_send' => 'block_protocol_filter_sentry_event'
  ];	


  \Sentry\init($sentry_init_args);	

  $public_id = block_protocol_public_id();

  if(!empty($public_id)){
    \Sentry\configureScope(function (\Sentry\State\Scope $scope) use ($public_id) {
        $scope->setUser(['id' => $public_id]);
    });
  }
}
