/**
 * The Gutenberg plugin loads blocks in the editor inside an iFrame. Blocks are rendered via a React portal.
 * This function returns the iFrame element, if the plugin is active.
 *
 * The iFrame is likely to be introduced to WP Core at some point, but the stated plan (as of March 2023)
 * is to only use it when all blocks are API v3+.
 *
 * Note: the current check depends on 'editor' appearing in the iFrame's title, and is therefore fragile.
 *
 * The Pull Request explaining that WP core will only iFrame editors where all blocks are API v3+
 * @see https://github.com/WordPress/gutenberg/pull/48076
 *
 * The code loading the iFrame:
 * @see https://make.wordpress.org/core/2021/06/29/blocks-in-an-iframed-template-editor/
 *
 * Explanation of the motivation for the iFrame:
 * @see https://github.com/WordPress/gutenberg/blob/trunk/packages/block-editor/src/components/iframe/index.js
 */
export const getContainingIframe = (): HTMLIFrameElement | null =>
  document.querySelector("iframe[title*='editor' i]");
