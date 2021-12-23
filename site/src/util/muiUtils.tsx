export const parseIntFromPixelString = (pixelString: string): number => {
  if (!pixelString.endsWith("px")) {
    throw new Error(`The pixel string "${pixelString}" doesn't end with "px"`);
  }

  return parseInt(pixelString.slice(0, -2), 10);
};
