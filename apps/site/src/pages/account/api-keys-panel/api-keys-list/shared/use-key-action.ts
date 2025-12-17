import { useTheme } from "@mui/material";
import { useEffect, useRef, useState } from "react";

type KeyAction = "rename" | "revoke";

export const useKeyAction = () => {
  const [keyAction, setKeyAction] = useState<KeyAction>();
  const theme = useTheme();
  const query = theme.breakpoints.up("md").replace("@media ", "");
  const didMatch = useRef<boolean | undefined>(undefined);

  useEffect(() => {
    const mediaQuery = window.matchMedia(query);

    const onChange = ({ matches }: MediaQueryListEvent | MediaQueryList) => {
      if (didMatch.current !== matches) {
        didMatch.current = matches;
        setKeyAction(undefined);
      }
    };

    mediaQuery.addEventListener("change", onChange);
    onChange(mediaQuery);

    return () => {
      mediaQuery.removeEventListener("change", onChange);
    };
  }, [query]);

  return [keyAction, setKeyAction] as const;
};
