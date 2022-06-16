export const generatePathWithoutParams = (path: string) => {
  const pathWithoutParams = path.match(/^[^?]*/)?.[0];
  if (!pathWithoutParams) {
    throw new Error(`Invalid path ${path}`);
  }
  return pathWithoutParams;
};
