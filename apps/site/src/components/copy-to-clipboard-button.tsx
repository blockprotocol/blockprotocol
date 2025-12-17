import { faClipboard } from "@fortawesome/free-regular-svg-icons";
import { faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import { useTheme } from "@mui/material";
import { useEffect, useMemo, useRef, useState } from "react";

import { Button } from "./button";
import { FontAwesomeIcon } from "./icons";

const boxShadow =
  "0px 4px 11px rgba(39, 50, 86, 0.02), 0px 2.59259px 6.44213px rgba(39, 50, 86, 0.04), 0px 0.5px 1px rgba(39, 50, 86, 0.15)";

export const CopyToClipboardButton = ({ copyText }: { copyText: string }) => {
  const timeoutRef = useRef<NodeJS.Timeout>(undefined);
  const [copied, setCopied] = useState(false);

  const handleClick = () => {
    if (navigator.clipboard) {
      void navigator.clipboard.writeText(copyText ?? "");

      setCopied(true);

      clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        setCopied(false);
      }, 1000);
    }
  };

  useEffect(() => {
    return () => {
      clearTimeout(timeoutRef.current);
    };
  }, []);

  const { palette } = useTheme();
  const copyStyle = useMemo(
    () => ({
      backgroundColor: palette.purple[70],
      color: "white",
      "& svg": {
        color: palette.purple[20],
      },
    }),
    [palette],
  );

  return (
    <Button
      variant="tertiary"
      size="small"
      squared
      onClick={handleClick}
      sx={[
        {
          width: 170,
          fontSize: 14,
          whiteSpace: "nowrap",
          color: palette.gray[70],
          boxShadow,

          "&:hover": {
            boxShadow,
          },
        },
        copied && {
          ...copyStyle,
          "&:hover": {
            ...copyStyle,
          },
        },
      ]}
      startIcon={
        <FontAwesomeIcon icon={copied ? faCheckCircle : faClipboard} />
      }
    >
      {copied ? "Copied to clipboard" : "Copy to clipboard"}
    </Button>
  );
};
