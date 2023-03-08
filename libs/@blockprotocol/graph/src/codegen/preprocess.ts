import { PreprocessContext } from "./context.js";
import { identifyLinkEntityTypes } from "./preprocess/identify-link-entity-types.js";
import { removeEmptyAllOfs } from "./preprocess/remove-empty-all-ofs.js";
import { rewriteTypeTitles } from "./preprocess/transform-type-names.js";

export const preprocess = (context: PreprocessContext) => {
  rewriteTypeTitles(context);
  removeEmptyAllOfs(context);
  identifyLinkEntityTypes(context);
  /* @todo - if properties are empty, remove the `allOf` */
};
