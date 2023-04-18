import { useTheme } from "@mui/material";
import { useEffect, useRef, useState } from "react";

import { KeyActionStatus } from "../types";

export const useKeyActionStatus = () => {
  const [keyActionStatus, setKeyActionStatus] = useState<KeyActionStatus>();
  const theme = useTheme();
  const query = theme.breakpoints.up("md").replace("@media ", "");
  const didMatch = useRef<boolean | undefined>();

  useEffect(() => {
    const mediaQuery = window.matchMedia(query);

    const onChange = ({ matches }: MediaQueryListEvent | MediaQueryList) => {
      if (didMatch.current !== matches) {
        didMatch.current = matches;
        setKeyActionStatus(undefined);
      }
    };

    mediaQuery.addEventListener("change", onChange);
    onChange(mediaQuery);

    return () => {
      mediaQuery.removeEventListener("change", onChange);
    };
  }, [query]);

  return [keyActionStatus, setKeyActionStatus] as const;
};
