import { useEffect, useRef } from "react";

import { MaybePlainOrRichText } from "./shared";

const generateComparableString = (text: MaybePlainOrRichText) =>
  typeof text === "string" ? text : JSON.stringify(text);

export const useDidTextChange = (text: MaybePlainOrRichText) => {
  const previousTextRef = useRef<MaybePlainOrRichText>(text);

  useEffect(() => {
    previousTextRef.current = generateComparableString(text);
  });

  return (
    generateComparableString(text) !==
    generateComparableString(previousTextRef.current)
  );
};
