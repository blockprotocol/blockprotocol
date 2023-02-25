/* @todo - remove this when the type-editor uses a newer version of the type-system */
export const removeAdditionalProperties = (object: Record<string, unknown>) => {
  for (const key in object) {
    if (key === "additionalProperties") {
      // eslint-disable-next-line no-param-reassign -- we want to mutate
      delete object[key];
    } else if (typeof object[key] === "object") {
      removeAdditionalProperties(object[key] as Record<string, unknown>);
    }
  }
};
