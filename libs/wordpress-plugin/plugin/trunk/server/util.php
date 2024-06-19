<?php
require_once __DIR__ . "/block-api-endpoints.php";

function get_block_protocol_entities_and_locations()
{
  $entities = get_all_block_protocol_entities();

  $posts = get_posts([
    "numberposts" => -1,
    "post_type" => "any",
    "post_status" => ['publish', 'pending', 'draft', 'auto-draft', 'future', 'private', 'inherit', 'trash']
  ]);

  foreach ($entities as $index => $entity) {
    $posts_found_in = array_filter($posts, function ($post) use ($entity) {
      $blocks = parse_blocks($post->post_content);
      foreach ($blocks as $block) {
        if (isset($block["attrs"]["entityId"]) && $block["attrs"]["entityId"] == $entity["entity_id"]) {
          return true;
        }
      }
      return false;
    });

    $entities[$index]["locations"] = array_map(function ($post) {
      return [
        "title" => $post->post_title,
        "edit_link" => get_edit_post_link($post)
      ];
    }, $posts_found_in);
  }

  return $entities;
}

?>
