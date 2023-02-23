/**
 * Insert shy hyphen indicators at capital letters within single words to improve wrapping ability
 */
export const shy = (text: string) =>
  text.replace(/([a-z])([A-Z])/g, "$1\u00ad$2");
