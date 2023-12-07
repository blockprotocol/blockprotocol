<?php

function block_protocol_validate_filter($filter)
{
  if (!isset($filter['field'])) {
    throw new InvalidArgumentException("Filter is missing 'field' parameter");
  }

  if (!is_array($filter['field'])) {
    throw new InvalidArgumentException("'field' parameter must be an array");
  }

  if (empty($filter['field'])) {
    throw new InvalidArgumentException("'field' parameter must not be empty");
  }

  if (!isset($filter['operator'])) {
    throw new InvalidArgumentException("Filter is missing 'operator' parameter");
  }

  if (!is_string($filter['operator'])) {
    throw new InvalidArgumentException("'operator' parameter must be a string");
  }

  if (!in_array($filter['operator'], array("IS_DEFINED", "IS_NOT_DEFINED", "CONTAINS_SEGMENT", "DOES_NOT_CONTAIN_SEGMENT", "EQUALS", "DOES_NOT_EQUAL", "STARTS_WITH", "ENDS_WITH"))) {
    throw new InvalidArgumentException("Invalid 'operator' parameter, got: " . $filter['operator']);
  }
}

function block_protocol_validate_sort($filter)
{
  if (!isset($filter['field'])) {
    throw new InvalidArgumentException("Sort is missing 'field' parameter");
  }

  if (!is_array($filter['field'])) {
    throw new InvalidArgumentException("'field' parameter must be an array");
  }

  if (empty($filter['field'])) {
    throw new InvalidArgumentException("'field' parameter must not be empty");
  }

  if (isset($filter['desc']) && !is_bool($filter['desc'])) {
    throw new InvalidArgumentException("Sort has a 'desc' parameter that is not a boolean");
  }
}

function block_protocol_encode_filter_value($value)
{
  if (is_int($value)) {
    return "{$value}";
  } elseif (is_string($value)) {
    return "\"{$value}\"";
  } else {
    return block_protocol_json_encode($value);
  }
}

function block_protocol_extract_filter_value($filter, $raw = false)
{
  $filter_value = $filter['value'];
  if (!isset($filter_value)) {
    throw new InvalidArgumentException("Filter is missing 'value' parameter");
  }

  if ($raw) {
    return $filter_value;
  }

  return block_protocol_encode_filter_value($filter_value);
}

/**
 * This function will return a SQL string that casts text to JSON. 
 * Note that this is function is "unsafe" and shouldn't have any direct user data passed into it.
 */
function block_protocol_db_json_unsafe_cast(string $value, bool $is_maria_db)
{
  if($is_maria_db) {
    return "JSON_COMPACT({$value})";
  } else {
    return "CAST({$value} AS JSON)";
  }
}

function block_protocol_build_string_filter($filter_value, $json_path, $operator, &$sql_fragment, &$values, bool $is_maria_db)
{
  global $wpdb;
  $escaped_filter_value = $wpdb->esc_like($filter_value);

  if ($operator === "CONTAINS_SEGMENT") {
    $sql_fragment = block_protocol_db_json_unsafe_cast("JSON_SEARCH(properties, 'one', %s, NULL, %s)", $is_maria_db) 
                    . " IS NOT NULL";
    $values[] = '%' . $escaped_filter_value . '%';
    $values[] = $json_path;
  } elseif ($operator === "DOES_NOT_CONTAIN_SEGMENT") {
    $sql_fragment = block_protocol_db_json_unsafe_cast("JSON_SEARCH(properties, 'one', '%%%s%%', NULL, %s)", $is_maria_db)
                    . " IS NULL";
    $values[] = $escaped_filter_value;
    $values[] = $json_path;
  } elseif ($operator === "STARTS_WITH") {
    $sql_fragment = block_protocol_db_json_unsafe_cast("JSON_SEARCH(properties, 'one', %s, NULL, %s)", $is_maria_db)
                    . " IS NOT NULL";
    $values[] = $escaped_filter_value . '%';
    $values[] = $json_path;
  } elseif ($operator === "ENDS_WITH") {
    $sql_fragment = block_protocol_db_json_unsafe_cast("JSON_SEARCH(properties, 'one', %s, NULL, %s)", $is_maria_db)
                    . " IS NOT NULL";
    $values[] = '%' . $escaped_filter_value;
    $values[] = $json_path;
  } else {
    throw new InvalidArgumentException("Invalid operator for string filter");
  }
}

function block_protocol_build_array_filter($raw_filter_value, $json_path, $operator, &$sql_fragment, &$values, bool $is_maria_db)
{
  $encoded_value = block_protocol_encode_filter_value($raw_filter_value);

  if ($operator === "CONTAINS_SEGMENT") {
    $sql_fragment = "JSON_CONTAINS(JSON_EXTRACT(properties, %s), %s)";
    $values[] = $json_path;
    $values[] = $encoded_value;
  } elseif ($operator === "DOES_NOT_CONTAIN_SEGMENT") {
    $sql_fragment = "NOT JSON_CONTAINS(JSON_EXTRACT(properties, %s), %s)";
    $values[] = $json_path;
    $values[] = $encoded_value;
  } elseif ($operator === "STARTS_WITH") {
    // To query for starts_with we need to check that the first element in the db array is equal to the first element in the filter value
    // then we check for the whole list existing in the db array
    // finally we check that the nth element in the db array is equal to the last (nth) element in the filter value
    $filter_value_count = count($raw_filter_value);
    if ($filter_value_count >= 1) {
      $sql_fragment = block_protocol_db_json_unsafe_cast("JSON_EXTRACT(properties, CONCAT(%s, '[0]'))", $is_maria_db) 
                      . " = "
                      . block_protocol_db_json_unsafe_cast("%s", $is_maria_db);
      $values[] = $json_path;
      $values[] = $raw_filter_value[0];

      if ($filter_value_count > 1) {
        $sql_fragment .= " AND JSON_CONTAINS(JSON_EXTRACT(properties, %s), %s)";
        $values[] = $json_path;
        $values[] = $encoded_value;

        $last_idx = $filter_value_count - 1;
        $sql_fragment .= " AND "
                         . block_protocol_db_json_unsafe_cast("JSON_EXTRACT(properties, CONCAT(%s, '[%d]'))", $is_maria_db)
                         . " = "
                         . block_protocol_db_json_unsafe_cast("%s", $is_maria_db);
        $values[] = $json_path;
        $values[] = $last_idx;
        $values[] = $raw_filter_value[$last_idx];
      }
    }
  } elseif ($operator === "ENDS_WITH") {
    // ends_with is very similar to starts_with, but we start at the end of the array instead of the beginning
    $filter_value_count = count($raw_filter_value);
    if ($filter_value_count >= 1) {
      $last_idx = $filter_value_count - 1;
      $sql_fragment = block_protocol_db_json_unsafe_cast("JSON_EXTRACT(properties, CONCAT(%s, '[', JSON_LENGTH(JSON_EXTRACT(properties, %s)) - 1, ']'))", $is_maria_db)
                      . " = "
                      .  block_protocol_db_json_unsafe_cast("%s", $is_maria_db);
      $values[] = $json_path;
      $values[] = $json_path;
      $values[] = $raw_filter_value[$last_idx];

      if ($filter_value_count > 1) {
        $sql_fragment .= " AND JSON_CONTAINS(JSON_EXTRACT(properties, %s), %s)";
        $values[] = $json_path;
        $values[] = $encoded_value;

        $sql_fragment .= " AND "
                         . block_protocol_db_json_unsafe_cast("JSON_EXTRACT(properties, CONCAT(%s, '[', JSON_LENGTH(JSON_EXTRACT(properties, %s)) - %d, ']'))", $is_maria_db)
                         . " = "
                         .  block_protocol_db_json_unsafe_cast("%s", $is_maria_db);
        $values[] = $json_path;
        $values[] = $json_path;
        $values[] = $filter_value_count;
        $values[] = $raw_filter_value[0];
      }
    }
  } else {
    throw new InvalidArgumentException("Invalid operator for string filter");
  }
}


/*
This function takes a `MultiFilter` and returns a string that can be used in a 
SQL query. The SQL query will make use of the `JSON_*` operators supported in MySQL 8+.
It's absolutely crucial that we do not concatenate SQL strings together from 
user input to prevent any form of SQL injeciton.
We get around this by using placeholders for prepared statements in place of any
kind of user value, and collect a list of values to be used in the prepared statement.
*/
function block_protocol_query_entities(array $multi_filter, array $multi_sort, bool $is_maria_db)
{
  $multi_filter_operator = isset($multi_filter['operator']) ? $multi_filter['operator'] : [];
  $multi_filters = isset($multi_filter['filters']) ? $multi_filter['filters'] : [];
  if ($multi_filters && !is_array($multi_filters)) {
    throw new InvalidArgumentException("MultiFilter 'filters' parameter is invalid");
  }

  if ($multi_filter_operator && !in_array($multi_filter_operator, array("AND", "OR"))) {
    throw new InvalidArgumentException("MultiFilter 'operator' parameter is either missing or invalid");
  }

  if (!isset($multi_sort) || !is_array($multi_sort)) {
    throw new InvalidArgumentException("MultiSort parameter must be an array");
  }


  $filter_placeholders = array();
  $filter_values = array();

  foreach ($multi_filters as $subfilter) {
    block_protocol_validate_filter($subfilter);

    $field = $subfilter['field'];
    $operator = $subfilter['operator'];

    $json_path = '$.' . implode('.', array_map(function ($value) {
      return is_int($value) ? $value : "\"{$value}\"";
    }, $field));

    $sql_fragment = '';

    if ($operator === "IS_DEFINED") {
      $sql_fragment = "JSON_CONTAINS_PATH(properties, 'one', %s)";
      $filter_values[] = $json_path;
    } elseif ($operator === "IS_NOT_DEFINED") {
      $sql_fragment = "NOT JSON_CONTAINS_PATH(properties, 'one', %s)";
      $filter_values[] = $json_path;
    } elseif ($operator === "EQUALS") {
      $filter_value = block_protocol_extract_filter_value($subfilter);
      $sql_fragment = block_protocol_db_json_unsafe_cast("JSON_EXTRACT(properties, %s)", $is_maria_db)
                      . " = "
                      . block_protocol_db_json_unsafe_cast("%s", $is_maria_db);
      $filter_values[] = $json_path;
      $filter_values[] = $filter_value;
    } elseif ($operator === "DOES_NOT_EQUAL") {
      $filter_value = block_protocol_extract_filter_value($subfilter);
      $sql_fragment = block_protocol_db_json_unsafe_cast("JSON_EXTRACT(properties, %s)", $is_maria_db)
                      . " != "
                      . block_protocol_db_json_unsafe_cast("%s", $is_maria_db);
      $filter_values[] = $json_path;
      $filter_values[] = $filter_value;
    } elseif ($filter_value = block_protocol_extract_filter_value($subfilter, $raw = true)) {
      if (is_array($filter_value)) {
        block_protocol_build_array_filter($filter_value, $json_path, $operator, $sql_fragment, $filter_values, $is_maria_db);
      } elseif (is_string($filter_value)) {
        block_protocol_build_string_filter($filter_value, $json_path, $operator, $sql_fragment, $filter_values, $is_maria_db);
      } else {
        // Unsatisfiable filter, make sure we return nothing
        $sql_fragment = "1 == 0";
      }
    }

    if ($sql_fragment) {
      $filter_placeholders[] = "(" . $sql_fragment . ")";
    }
  }

  $sort_placeholders = array();
  $sort_values = array();

  foreach ($multi_sort as $subsort) {
    block_protocol_validate_sort($subsort);

    $field = $subsort['field'];
    $desc = isset($subsort['desc']) && $subsort['desc'];

    $json_path = '$.' . implode('.', array_map(function ($value) {
      return is_int($value) ? $value : "\"{$value}\"";
    }, $field));

    $sql_fragment = "JSON_VALUE(properties, %s) ";
    $sql_fragment .= $desc ? "DESC" : "ASC";
    $sort_values[] = $json_path;

    $sort_placeholders[] = $sql_fragment;
  }

  $operator = $multi_filter_operator === 'AND' ? 'AND' : 'OR';

  $where_clause = empty($filter_placeholders) ? "" : "WHERE " . implode(" {$operator} ", $filter_placeholders);
  $sort_clause = empty($sort_placeholders) ? "" : "ORDER BY " . implode(", ", $sort_placeholders);

  $selection = block_protocol_entity_selection();
  $table = get_block_protocol_table_name();
  return array(
    'sql' => "SELECT {$selection} FROM {$table} {$where_clause} {$sort_clause}",
    'values' => array_merge($filter_values, $sort_values),
  );
}
