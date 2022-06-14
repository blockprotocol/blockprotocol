/**
 * When parcel bundles an HTML file, it converts script[type=module] to a
 * regular script tag, and gives it an ID which is then checked against a
 * shared cache, ensuring its only executed once (just like with regular
 * imports). This behavior is not desirable when we want to be able to include
 * the exported HTML string multiple times on a page, and have scripts execute
 * multiple times. This replaces the generated ID with one generated at run
 * time, per script tag, enabling scripts to be run multiple times. This is
 * only necessary when using parcel as your bundler.
 *
 * @todo find a way to remove the need for this
 */
export default function prepareHtml(htmlString) {
  const match = htmlString.match(/,\s?([^,]+?),\s?"parcelRequire/);

  if (!match?.[1]) {
    throw new Error("Cannot find bundle id");
  }
  const script =
    "(document.currentScript.bundleId=document.currentScript.bundleId||(Math.random() + 1).toString(36).substr(2))";
  return htmlString
    .replaceAll(`${match[1]}:`, `[${script}]:`)
    .replaceAll(`${match[1]}`, `(${script})`);
}
