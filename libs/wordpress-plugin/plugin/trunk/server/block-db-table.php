<?php

const MINIMUM_MYSQL_VERSION = "8.0.0";
const MINIMUM_MARIADB_VERSION = "10.2.7";

function block_protocol_is_database_supported()
{
  global $wpdb;
  
  $db_version = $wpdb->db_version();
  $db_server_info = $wpdb->db_server_info();

  if (strpos($db_server_info, 'MariaDB') != false) {
    // site is using MariaDB
    return $db_version >= MINIMUM_MARIADB_VERSION;
  } else {
    // site is using MySQL
    return $db_version >= MINIMUM_MYSQL_VERSION;
  }
}

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
    left_entity_id char(36),
    right_entity_id char(36),
    left_to_right_order int UNSIGNED,
    right_to_left_order int UNSIGNED,

    PRIMARY KEY (entity_id),

    INDEX (left_entity_id),
    INDEX (right_entity_id),
    INDEX (created_at),
    INDEX (updated_at)
  ) $charset_collate;";

  require_once(ABSPATH . 'wp-admin/includes/upgrade.php');

  // Some MariaDB versions doesn't support recursive references within the table itself,
  // so we add the references after the table creation
  $sql .= "ALTER TABLE `{$wpdb->prefix}block_protocol_entities` 
    ADD FOREIGN KEY (left_entity_id) REFERENCES `{$wpdb->prefix}block_protocol_entities` (entity_id) ON DELETE CASCADE,
    ADD FOREIGN KEY (right_entity_id) REFERENCES `{$wpdb->prefix}block_protocol_entities` (entity_id) ON DELETE CASCADE;
  ";
  dbDelta($sql);
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
