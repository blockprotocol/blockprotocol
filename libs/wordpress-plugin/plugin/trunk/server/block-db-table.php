<?php

function block_protocol_migration_1()
{
  global $wpdb;
  $charset_collate = $wpdb->get_charset_collate();

  $sql = "CREATE TABLE `{$wpdb->prefix}block_protocol_entities` (
    -- common data across all entities
    entity_id char(36) NOT NULL,
    entity_type_id text NOT NULL,
    properties json,
    created_by_id bigint(20) UNSIGNED NOT NULL,
    created_at datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_by_id bigint(20) UNSIGNED NOT NULL,
    updated_at datetime NOT NULL,

    -- metadata for entities which represent links only
    left_entity_id char(36) REFERENCES `{$wpdb->prefix}block_protocol_entities` (entity_id) ON DELETE CASCADE,
    right_entity_id char(36) REFERENCES `{$wpdb->prefix}block_protocol_entities` (entity_id) ON DELETE CASCADE,
    left_to_right_order int UNSIGNED,
    right_to_left_order int UNSIGNED,

    PRIMARY KEY (entity_id),

    INDEX (left_entity_id),
    INDEX (right_entity_id),
    INDEX (created_at),
    INDEX (updated_at)
  ) $charset_collate;";

  require_once(ABSPATH . 'wp-admin/includes/upgrade.php');

  dbDelta($sql);
  block_protocol_maybe_capture_error($wpdb->last_error);
}

function block_protocol_migrate()
{
  $saved_version = (int) get_site_option('block_protocol_db_migration_version');

  if ($saved_version < 2) {
    block_protocol_migration_1();
    update_site_option('block_protocol_db_migration_version', 2);
  }

  // future migrations go here
}

add_action('admin_init', 'block_protocol_migrate');

function count_block_protocol_entities()
{
  global $wpdb;

  $table = get_block_protocol_table_name();

  $sql = "SELECT count(*) FROM {$table};";

  $count = $wpdb->get_var($sql);

  block_protocol_maybe_capture_error($wpdb->last_error);
  return $count;
}
?>
