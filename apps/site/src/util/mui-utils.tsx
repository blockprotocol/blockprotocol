export const parseIntFromPixelString = (pixelString: string): number => {
  if (!pixelString.endsWith("px")) {
    throw new Error(`The pixel string "${pixelString}" doesn't end with "px"`);
  }

  return parseInt(pixelString.slice(0, -2), 10);
};

/**
 * @see https://github.com/mui/material-ui/blob/master/libs/mui-utils/src/getScrollbarSize.ts
 * */
export const getScrollbarSize = (doc: Document) => {
  const documentWidth = doc.documentElement.clientWidth;
  return Math.abs(window.innerWidth - documentWidth);
};
