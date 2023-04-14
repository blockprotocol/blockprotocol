<?php

function get_block_protocol_table_name()
{
  global $wpdb;

  return "{$wpdb->prefix}block_protocol_entities";
}

// @see https://stackoverflow.com/a/15875555/17217717
function generate_block_protocol_guidv4()
{
  $data = openssl_random_pseudo_bytes(16);

  assert(strlen($data) == 16);

  $data[6] = chr(ord($data[6]) & 0x0f | 0x40); // set version to 0100
  $data[8] = chr(ord($data[8]) & 0x3f | 0x80); // set bits 6-7 to 10

  return vsprintf('%s%s-%s-%s-%s-%s%s%s', str_split(bin2hex($data), 4));
}

function block_protocol_entity_selection()
{
  return "
  entity_id,
  entity_type_id,
  left_entity_id,
  right_entity_id,
  left_to_right_order,
  right_to_left_order,
  properties,
  created_by_id,
  created_at,
  updated_by_id,
  updated_at";

}

/**
 * Natively traverse a subgraph using a base where term.
 * This functions is meant to be as compatible as possible with various MySQL/MariaDB versions
 */
function block_protocol_native_subgraph_query(
  string $base_where_term,
  int $has_left_incoming_depth,
  int $has_right_incoming_depth,
  int $has_left_outgoing_depth,
  int $has_right_outgoing_depth
) {
  global $wpdb;

  $table = get_block_protocol_table_name();

  $subgraph = [];
  $queue = [];

  // Initial query using the base where term
  $selection = block_protocol_entity_selection();
  $sql = $wpdb->prepare("
    SELECT
      " . $selection . ",
      0 as has_left_incoming_depth,
      0 as has_right_incoming_depth,
      0 as has_left_outgoing_depth,
      0 as has_right_outgoing_depth
    FROM {$table}
    " . $base_where_term
  );

  // Initialize the queue with the starting nodes
  $queue = $wpdb->get_results($sql, ARRAY_A);

  $visited = [];

  // Loop while the queue is not empty
  while (!empty($queue)) {
    // Dequeue the next node
    $node = array_shift($queue);

    // Skip nodes that have already been visited
    if ($visited[$node['entity_id']] ?? false) {
        continue;
    }

    $visited[$node['entity_id']] = true;

    // ensure that the depths are all ints
    $node['has_left_incoming_depth'] = (int) $node['has_left_incoming_depth'];
    $node['has_right_incoming_depth'] = (int) $node['has_right_incoming_depth'];
    $node['has_left_outgoing_depth'] = (int) $node['has_left_outgoing_depth'];
    $node['has_right_outgoing_depth'] = (int) $node['has_right_outgoing_depth'];

    // Add the node to the result list
    $subgraph[] = $node;

    $next_nodes = [];

    // Add nodes connected by incoming has_left links
    if ($node['has_left_incoming_depth'] < $has_left_incoming_depth) {
      $sql = $wpdb->prepare(
        "SELECT
          " . $selection . ",
          %d + 1 as has_left_incoming_depth,
          %d as has_right_incoming_depth,
          %d as has_left_outgoing_depth,
          %d as has_right_outgoing_depth
        FROM {$table}
        WHERE left_entity_id = %d
        ",
        $node['has_left_incoming_depth'],
        $node['has_right_incoming_depth'],
        $node["has_left_outgoing_depth"],
        $node["has_right_outgoing_depth"],
        $node['entity_id']
      );

      $next_nodes = array_merge($next_nodes, $wpdb->get_results($sql, ARRAY_A));
    }

    // Add nodes connected by incoming has_right links
    if ($node['has_right_incoming_depth'] < $has_right_incoming_depth) {
      $sql = $wpdb->prepare(
        "SELECT
          " . $selection . ",
          %d as has_left_incoming_depth,
          %d + 1 as has_right_incoming_depth,
          %d as has_left_outgoing_depth,
          %d as has_right_outgoing_depth
        FROM {$table}
        WHERE right_entity_id = %d
        ",
        $node['has_left_incoming_depth'],
        $node['has_right_incoming_depth'],
        $node["has_left_outgoing_depth"],
        $node["has_right_outgoing_depth"],
        $node['entity_id']
      );

      $next_nodes = array_merge($next_nodes, $wpdb->get_results($sql, ARRAY_A));
    }

    // Add nodes connected by outgoing has_left links
    if ($node['has_left_outgoing_depth'] < $has_left_outgoing_depth) {
      $sql = $wpdb->prepare(
        "SELECT
          " . $selection . ",
          %d as has_left_incoming_depth,
          %d as has_right_incoming_depth,
          %d + 1 as has_left_outgoing_depth,
          %d as has_right_outgoing_depth
        FROM {$table}
        WHERE entity_id = %d
        ",
        $node['has_left_incoming_depth'],
        $node['has_right_incoming_depth'],
        $node["has_left_outgoing_depth"],
        $node["has_right_outgoing_depth"],
        $node['left_entity_id']
      );

      $next_nodes = array_merge($next_nodes, $wpdb->get_results($sql, ARRAY_A));
    }

    // Add nodes connected by outgoing has_right links
    if ($node['has_right_outgoing_depth'] < $has_right_outgoing_depth) {
      $sql = $wpdb->prepare(
        "SELECT
          " . $selection . ",
          %d as has_left_incoming_depth,
          %d as has_right_incoming_depth,
          %d as has_left_outgoing_depth,
          %d + 1 as has_right_outgoing_depth
        FROM {$table}
        WHERE entity_id = %d
        ",
        $node['has_left_incoming_depth'],
        $node['has_right_incoming_depth'],
        $node["has_left_outgoing_depth"],
        $node["has_right_outgoing_depth"],
        $node['right_entity_id']
      );

      $next_nodes = array_merge($next_nodes, $wpdb->get_results($sql, ARRAY_A));
    }

    // Add the next nodes to the queue
    foreach ($next_nodes as $next_node)  {
      $entity_id = $next_node['entity_id'];

      if (!($visited[$entity_id] ?? false)) {
        $queue[] = $next_node;
      }
    }
  }

  foreach($subgraph as &$element) {
    unset($element["has_left_incoming_depth"]);
    unset($element["has_right_incoming_depth"]);
    unset($element["has_left_outgoing_depth"]);
    unset($element["has_right_outgoing_depth"]);
  }

  return $subgraph;
}


/**
 * Traverse a subgraph using Recursive CTEs in the DB.
 * This functions is likely unsupported by older versions of the DB.
 */
function block_protocol_db_subgraph_query(
  string $base_where_term,
  int $has_left_incoming_depth,
  int $has_right_incoming_depth,
  int $has_left_outgoing_depth,
  int $has_right_outgoing_depth
)
{
  global $wpdb;

  $table = get_block_protocol_table_name();

  $selection = block_protocol_entity_selection();

  $sql = $wpdb->prepare(
    "WITH RECURSIVE linked_entities AS (
    -- base query term
    SELECT
        " . $selection . ",
        0 as has_left_incoming_depth,
        0 as has_right_incoming_depth,
        0 as has_left_outgoing_depth,
        0 as has_right_outgoing_depth
    FROM {$table} e1

    " . $base_where_term . "

    UNION

    -- recursive query term for following incoming has_left links
    SELECT
        e2.entity_id,
        e2.entity_type_id,
        e2.left_entity_id,
        e2.right_entity_id,
        e2.left_to_right_order,
        e2.right_to_left_order,
        e2.properties,
        e2.created_by_id,
        e2.created_at,
        e2.updated_by_id,
        e2.updated_at,
        has_left_incoming_depth + 1,
        has_right_incoming_depth,
        has_left_outgoing_depth,
        has_right_outgoing_depth
    FROM {$table} e2
    JOIN linked_entities
      ON e2.left_entity_id = linked_entities.entity_id
    WHERE has_left_incoming_depth < %d

    UNION

    -- recursive query term for following incoming has_right links
    SELECT
        e2.entity_id,
        e2.entity_type_id,
        e2.left_entity_id,
        e2.right_entity_id,
        e2.left_to_right_order,
        e2.right_to_left_order,
        e2.properties,
        e2.created_by_id,
        e2.created_at,
        e2.updated_by_id,
        e2.updated_at,
        has_left_incoming_depth,
        has_right_incoming_depth + 1,
        has_left_outgoing_depth,
        has_right_outgoing_depth
    FROM {$table} e2
    JOIN linked_entities
      ON e2.right_entity_id = linked_entities.entity_id
    WHERE has_right_incoming_depth < %d

    UNION

    -- recursive query term for following outgoing has_left links
    SELECT
        e2.entity_id,
        e2.entity_type_id,
        e2.left_entity_id,
        e2.right_entity_id,
        e2.left_to_right_order,
        e2.right_to_left_order,
        e2.properties,
        e2.created_by_id,
        e2.created_at,
        e2.updated_by_id,
        e2.updated_at,
        has_left_incoming_depth,
        has_right_incoming_depth,
        has_left_outgoing_depth +1,
        has_right_outgoing_depth
    FROM {$table} e2
    JOIN linked_entities
      ON e2.entity_id = linked_entities.left_entity_id
    WHERE has_left_outgoing_depth < %d

    UNION

    -- recursive query term for following outgoing has_right links
    SELECT
        e2.entity_id,
        e2.entity_type_id,
        e2.left_entity_id,
        e2.right_entity_id,
        e2.left_to_right_order,
        e2.right_to_left_order,
        e2.properties,
        e2.created_by_id,
        e2.created_at,
        e2.updated_by_id,
        e2.updated_at,
        has_left_incoming_depth,
        has_right_incoming_depth,
        has_left_outgoing_depth,
        has_right_outgoing_depth + 1
    FROM {$table} e2
    JOIN linked_entities
      ON e2.entity_id = linked_entities.right_entity_id
    WHERE has_right_outgoing_depth < %d
  )
  SELECT
    " . $selection . "
  FROM linked_entities
  GROUP BY " . $selection . ";",
    $has_left_incoming_depth,
    $has_right_incoming_depth,
    $has_left_outgoing_depth,
    $has_right_outgoing_depth
  );

  $subgraph = $wpdb->get_results($sql, ARRAY_A);

  return $subgraph;
}

function get_block_protocol_subgraph(
  string $base_where_term,
  int $has_left_incoming_depth,
  int $has_right_incoming_depth,
  int $has_left_outgoing_depth,
  int $has_right_outgoing_depth
)
{
  global $wpdb;
  // See https://dev.mysql.com/doc/refman/8.0/en/mysql-nutshell.html
  $mysql_recursive_cte_version = "8.0";
  // See https://mariadb.com/kb/en/mariadb-1022-release-notes/#notable-changes
  $mariadb_recursive_cte_version = "10.2.2";

  // Dynamically choose how to execute the query based on the database version
  $action =
    block_protocol_database_at_version(
      $mysql_recursive_cte_version,
      $mariadb_recursive_cte_version
    )
    ? "block_protocol_db_subgraph_query"
    : "block_protocol_native_subgraph_query";

  $subgraph = ($action)(
    $base_where_term,
    $has_left_incoming_depth,
    $has_right_incoming_depth,
    $has_left_outgoing_depth,
    $has_right_outgoing_depth,
  );

  block_protocol_maybe_capture_error($wpdb->last_error);
  return $subgraph;
}


function get_block_protocol_entity_row(string $entity_id)
{
  global $wpdb;

  $table = get_block_protocol_table_name();

  $sql = $wpdb->prepare("SELECT * FROM {$table} WHERE entity_id = %s", $entity_id);

  $entity = $wpdb->get_row($sql, ARRAY_A);

  block_protocol_maybe_capture_error($wpdb->last_error);
  return $entity;
}

function get_all_block_protocol_entities()
{
  global $wpdb;

  $table = get_block_protocol_table_name();

  $entities = $wpdb->get_results("SELECT * FROM {$table}", ARRAY_A);

  block_protocol_maybe_capture_error($wpdb->last_error);
  return $entities;
}

function block_protocol_json_encode(array $value)
{
  return json_encode($value, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
}

function query_block_protocol_entities(WP_REST_Request $request)
{
  global $wpdb;
  $params = $request->get_json_params();
  // @todo implement depths

  $multi_filter = $params["operation"]["multiFilter"] ?? [];
  $multi_sort = $params["operation"]["multiSort"] ?? [];

  $db_server_info = $wpdb->db_server_info();
  $is_maria_db = strpos($db_server_info, 'MariaDB') != false;

  try {
    $query = block_protocol_query_entities($multi_filter, $multi_sort, $is_maria_db);
  } catch (InvalidArgumentException $e) {
    return ["error" => $e->getMessage()];
  }

  $prepared = $wpdb->prepare($query['sql'], $query['values']);
  $entities = $wpdb->get_results($prepared, ARRAY_A);

  block_protocol_maybe_capture_error($wpdb->last_error);
  return ["entities" => $entities ?: []];
}

function get_block_protocol_entity(WP_REST_Request $request)
{
  global $wpdb;

  $entity_id = $request['entity_id'];

  $base_term = $wpdb->prepare("WHERE entity_id = %s", $entity_id);

  if (!$entity_id) {
    $results['error'] = "entity_id not provided";
    return $results;
  }

  $has_left_incoming = isset($request["has_left_incoming"]) ? $request["has_left_incoming"] : null;
  $has_right_incoming = isset($request["has_right_incoming"]) ? $request["has_right_incoming"] : null;
  $has_left_outgoing = isset($request["has_left_outgoing"]) ? $request["has_left_outgoing"] : null;
  $has_right_outgoing = isset($request["has_right_outgoing"]) ? $request["has_right_outgoing"] : null;

  if (!$has_left_incoming) {
    $has_left_incoming = 0;
  }
  if (!$has_right_incoming) {
    $has_right_incoming = 0;
  }
  if (!$has_left_outgoing) {
    $has_left_outgoing = 0;
  }
  if (!$has_right_outgoing) {
    $has_right_outgoing = 0;
  }

  if ($has_left_incoming > 9 || $has_left_outgoing > 9 || $has_right_incoming > 9 || $has_right_outgoing > 9) {
    $results['error'] = "A maximum depth setting of 9 is permitted for any single depth argument.";
    return $results;
  }

  $entities = get_block_protocol_subgraph(
    $base_term,
    $has_left_incoming,
    $has_right_incoming,
    $has_left_outgoing,
    $has_right_outgoing
  );

  if (count($entities) == 0) {
    $results['error'] = "Entity with id {$entity_id} not found";
    return $results;
  }

  $results = [];

  $results['entities'] = $entities;
  $results['depths'] = [
    // the MySQL driver might return integers as strings
    'has_left_incoming' => absint($has_left_incoming),
    'has_right_incoming' => absint($has_right_incoming),
    'has_left_outgoing' => absint($has_left_outgoing),
    'has_right_outgoing' => absint($has_right_outgoing)
  ];

  block_protocol_maybe_capture_error($wpdb->last_error);
  return $results;
}

function create_block_protocol_entity(WP_REST_Request $request)
{
  global $wpdb;

  $user_id = wp_get_current_user()->ID;

  $results = [];

  $params = $request->get_json_params();

  $entity_type_id = $params['entity_type_id'];

  if (!$entity_type_id) {
    $results['error'] = "You must provide 'entity_type_id' to create an entity";
    return $results;
  } else if (!filter_var($entity_type_id, FILTER_VALIDATE_URL)) {
    $results['error'] = "'entity_type_id' must be a valid URL pointing to an entity type schema";
    return $results;
  }

  $properties = block_protocol_json_encode($params['properties']);

  if (!$properties) {
    $results['error'] = "You must provide 'properties' to create an entity with";
    return $results;
  }

  if ($properties == "[]") {
    // if sent an empty properties object, json_encode will convert it into an array
    // we could JSON_FORCE_OBJECT json_encode but that would convert any empty arrays inside into objects
    // @todo different parsing strategy that preserves the original JSON
    $properties = "{}";
  }


  $entity_id = generate_block_protocol_guidv4();

  $insertion_data = [
    'entity_id' => $entity_id,
    'created_at' => current_time('mysql', 1),
    'updated_at' => current_time('mysql', 1),
    'properties' => $properties,
    'entity_type_id' => esc_url_raw($entity_type_id),
    'created_by_id' => $user_id,
    'updated_by_id' => $user_id,
  ];

  $left_entity_id = isset($params['left_entity_id']) ? $params['left_entity_id'] : null;
  $right_entity_id = isset($params['right_entity_id']) ? $params['right_entity_id'] : null;

  if (($left_entity_id && !$right_entity_id) || (!$left_entity_id && $right_entity_id)) {
    $results['error'] = "You must provide both 'left_entity_id' and 'right_entity_id' to create a link";
    return $results;
  }

  $left_to_right_order = isset($params['left_to_right_order']) ? $params['left_to_right_order'] : null;
  $right_to_left_order = isset($params['right_to_left_order']) ? $params['right_to_left_order'] : null;

  if (!$left_entity_id && ($left_to_right_order || $right_to_left_order)) {
    $results['error'] = "You must provide 'left_entity_id' and 'right_entity_id' to create a link with an order";
    return $results;
  }

  $insertion_data['left_entity_id'] = $left_entity_id;
  $insertion_data['right_entity_id'] = $right_entity_id;

  if ($left_to_right_order && is_numeric($left_to_right_order)) {
    $insertion_data['left_to_right_order'] = $left_to_right_order;
  }

  if ($right_to_left_order && is_numeric($right_to_left_order)) {
    $insertion_data['right_to_left_order'] = $right_to_left_order;
  }


  $success = $wpdb->insert(
    get_block_protocol_table_name(),
    $insertion_data
  );

  if (!$success) {
    $results['error'] = $wpdb->last_error;
    return $results;
  }

  $block_metadata = isset($params['block_metadata']) ? $params['block_metadata'] : null;

  if ($block_metadata) {
    block_protocol_page_data('new_block', [
      'blockSourceUrl' => $block_metadata['source_url'],
      'blockVersion' => $block_metadata['version'],
    ]);
  }

  $entity = get_block_protocol_entity_row($entity_id);

  $results['entity'] = $entity;

  block_protocol_maybe_capture_error($wpdb->last_error);
  return $results;
}

function update_block_protocol_entity(WP_REST_Request $request)
{
  global $wpdb;

  $user_id = wp_get_current_user()->ID;

  $results = [];

  $entity_id = $request['entity_id'];

  $params = $request->get_json_params();

  $left_to_right_order = isset($params['left_to_right_order']) ? $params['left_to_right_order'] : null;
  $right_to_left_order = isset($params['right_to_left_order']) ? $params['right_to_left_order'] : null;

  $encoded_properties = block_protocol_json_encode($params['properties']);

  if (!$encoded_properties) {
    $results['error'] = "You must provide 'properties' for an update";
    return $results;
  }

  if ($encoded_properties == "[]") {
    // if sent an empty properties object, json_encode will convert it into an array
    // we could JSON_FORCE_OBJECT json_encode but that would convert any empty arrays inside into objects
    // @todo different parsing strategy that preserves the original JSON
    $encoded_properties = "{}";
  }

  $update = [
    'properties' => $encoded_properties,
    'updated_at' => current_time('mysql', 1),
    'updated_by_id' => $user_id,
  ];

  if ($left_to_right_order && is_numeric($left_to_right_order)) {
    $update['left_to_right_order'] = $left_to_right_order;
  }

  if ($right_to_left_order && is_numeric($right_to_left_order)) {
    $update['right_to_left_order'] = $right_to_left_order;
  }

  $success = $wpdb->update(
    get_block_protocol_table_name(),
    $update,
    [
      'entity_id' => $entity_id
    ]
  );

  if (!$success) {
    $results['error'] = $wpdb->last_error;
    $results['success'] = $success;
    $results['encoded_properties'] = $encoded_properties;
    return $results;
  }

  $entity = get_block_protocol_entity_row($entity_id);

  $results['entity'] = $entity;

  block_protocol_maybe_capture_error($wpdb->last_error);
  return $results;
}

function delete_block_protocol_entity(WP_REST_Request $request)
{
  global $wpdb;

  $user_id = wp_get_current_user()->ID;

  $results = [];

  if ($user_id < 1) {
    $results['error'] = "You must be authenticated to do this";
    return $results;
  }

  $entity_id = $request['entity_id'];

  $success = $wpdb->delete(
    get_block_protocol_table_name(),
    [
      'entity_id' => $entity_id
    ]
  );

  if (!$success) {
    $results['error'] = $wpdb->last_error;
    $results['success'] = $success;
    $results['entity_id'] = $entity_id;
    return $results;
  }

  block_protocol_maybe_capture_error($wpdb->last_error);
  return true;
}

function upload_block_protocol_file(WP_REST_Request $request)
{
  require_once(ABSPATH . 'wp-admin/includes/file.php');
  require_once(ABSPATH . 'wp-admin/includes/image.php');

  global $wpdb;

  $user_id = wp_get_current_user()->ID;

  $results = [];

  if ($user_id < 1) {
    $results['error'] = "You must be authenticated to do this";
    return $results;
  }

  $url = isset($request['url']) ? $request['url'] : null;
  $description = $request['description'];
  $fileData = isset($request->get_file_params()['file']) ? $request->get_file_params()['file'] : null;

  if (!$fileData && !$url) {
    $results['error'] = "You must provide either a 'file' or a 'url'";
    return $results;
  }

  if ($url && $fileData) {
    $results['error'] = "You must provide either a 'file' or a 'url', not both";
    return $results;
  }

  if ($url) {
    $fileData = download_url($url);

    if (is_wp_error($fileData)) {
      $results['error'] = $fileData->get_error_message();
      $results['url'] = $url;
      return $results;
    }

    $filename = basename(strtok($url, "?"));
    $tmp_name = $fileData;
    $type = mime_content_type($fileData);
    $size = filesize($fileData);
  } else {
    $filename = $fileData['name'];
    $tmp_name = $fileData['tmp_name'];
    $type = mime_content_type($tmp_name);
    $size = filesize($tmp_name);
  }

  $file = [
    'name' => $filename,
    'tmp_name' => $tmp_name,
    'type' => $type,
    'size' => $size,
  ];

  $sideload = wp_handle_sideload(
    $file,
    [
      'test_form' => false
    ]
  );

  $sideload_error = isset($sideload['error']) ? $sideload['error'] : null;

  if (!empty($sideload_error)) {
    $results['error'] = $sideload_error;
    return $results;
  }

  $attachment_id = wp_insert_attachment(
    [
      'guid' => $sideload['url'],
      'post_mime_type' => $sideload['type'],
      'post_title' => basename($sideload['file']),
      'post_content' => $description ?? '',
      'post_status' => 'inherit',
    ],
    $sideload['file']
  );

  if (is_wp_error($attachment_id) || !$attachment_id) {
    $results['error'] = "Could not insert file into WordPress media library";
    return $results;
  }

  $metadata = wp_generate_attachment_metadata($attachment_id, $sideload['file']);

  // create a File entity to send to blocks
  $entity_id = generate_block_protocol_guidv4();

  $insertion_data = [
    'entity_id' => $entity_id,
    'created_at' => current_time('mysql', 1),
    'updated_at' => current_time('mysql', 1),
    'created_by_id' => $user_id,
    'updated_by_id' => $user_id,
    'properties' => block_protocol_json_encode([
      'https://blockprotocol.org/@blockprotocol/types/property-type/description/' => $description,
      'https://blockprotocol.org/@blockprotocol/types/property-type/file-name/' => $filename,
      'https://blockprotocol.org/@blockprotocol/types/property-type/file-size/' => $metadata['filesize'],
      'https://blockprotocol.org/@blockprotocol/types/property-type/file-url/' => $sideload['url'],
      'https://blockprotocol.org/@blockprotocol/types/property-type/mime-type/' => $sideload['type'],
    ]),
    'entity_type_id' => "https://blockprotocol.org/@blockprotocol/types/entity-type/remote-file/v/3"
  ];

  $success = $wpdb->insert(
    get_block_protocol_table_name(),
    $insertion_data
  );

  if (!$success) {
    $results['error'] = $wpdb->last_error;
    return $results;
  }

  $entity = get_block_protocol_entity_row($entity_id);

  $results['entity'] = $entity;

  block_protocol_maybe_capture_error($wpdb->last_error);
  return $results;
}

function call_block_protocol_service(WP_REST_Request $request)
{
  global $wpdb;

  $results = [];

  $params = $request->get_json_params();

  $provider_name = $params['provider_name'];
  $method_name = $params['method_name'];
  $data = $params['data'];

  $site_host = get_block_protocol_site_host();

  $url = $site_host . "/api/external-service-method";

  $body = block_protocol_json_encode([
    'providerName' => $provider_name,
    'methodName' => $method_name,
    'payload' => $data,
  ]);

  $results['body'] = $body;

  $options = get_option('block_protocol_options');

  $api_key = $options['block_protocol_field_api_key'];

  $service_call_args = [
    'headers' => [
      'Content-Type' => 'application/json',
      'X-Api-Key' => $api_key,
      'Origin' => get_site_url(),
    ],
    'body' => $body,
    'timeout' => 30
  ];

  $site_host = get_block_protocol_site_host();

  $response = wp_remote_post($url, $service_call_args);

  if (is_wp_error($response)) {
    $message = $response->get_error_message();
    $results['error'] = $message;
    return $results;
  }

  $body = json_decode($response["body"], true);

  if (isset($body['errors'])) {
    $errors = $body['errors'];
    $error = $errors[0];
    $message = $error['msg'];

    $results['error'] = $message;
    $results['errors'] = $errors;
    return $results;
  }

  $results['data'] = $body['externalServiceMethodResponse'];

  block_protocol_maybe_capture_error($wpdb->last_error);
  return $results;
}

add_action(
  'rest_api_init',
  function () {
    register_rest_route(
      'blockprotocol',
      '/entities/query',
      [
        'methods' => 'POST',
        'callback' => 'query_block_protocol_entities',
        'permission_callback' => '__return_true',
      ]
    );

    register_rest_route(
      'blockprotocol',
      '/entities/(?P<entity_id>\S+)',
      [
        'methods' => 'GET',
        'callback' => 'get_block_protocol_entity',
        'permission_callback' => '__return_true',
      ]
    );

    register_rest_route(
      'blockprotocol',
      '/entities',
      [
        'methods' => 'POST',
        'callback' => 'create_block_protocol_entity',
        'permission_callback' => function () {
            return current_user_can('edit_others_posts');
          }
      ]
    );

    register_rest_route(
      'blockprotocol',
      '/entities/(?P<entity_id>\S+)',
      [
        'methods' => 'PUT',
        'callback' => 'update_block_protocol_entity',
        'permission_callback' => function () {
            return current_user_can('edit_others_posts');
          }
      ]
    );

    register_rest_route(
      'blockprotocol',
      '/entities/(?P<entity_id>\S+)',
      [
        'methods' => 'DELETE',
        'callback' => 'delete_block_protocol_entity',
        'permission_callback' => function () {
            return current_user_can('edit_others_posts');
          }
      ]
    );

    register_rest_route(
      'blockprotocol',
      '/file',
      [
        'methods' => 'POST',
        'callback' => 'upload_block_protocol_file',
        'permission_callback' => function () {
            return current_user_can('edit_others_posts');
          }
      ]
    );

    register_rest_route(
      'blockprotocol',
      '/service',
      [
        'methods' => 'POST',
        'callback' => 'call_block_protocol_service',
        'permission_callback' => function () {
            return current_user_can('edit_others_posts');
          }
      ]
    );
  }
);

?>
