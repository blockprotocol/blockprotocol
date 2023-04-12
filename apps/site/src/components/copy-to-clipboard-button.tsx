import { faClipboard } from "@fortawesome/free-regular-svg-icons";
import { faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useRef, useState } from "react";

import { Button } from "./button";
import { FontAwesomeIcon } from "./icons";

const copyStyle = {
  backgroundColor: "purple.70",
  color: "white",
  "& svg": {
    color: "purple.20",
  },
};

const boxShadow =
  "0px 4px 11px rgba(39, 50, 86, 0.02), 0px 2.59259px 6.44213px rgba(39, 50, 86, 0.04), 0px 0.5px 1px rgba(39, 50, 86, 0.15)";

export const CopyToClipboardButton = ({ copyText }: { copyText: string }) => {
  const timeoutRef = useRef<NodeJS.Timeout>();
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
          color: "gray.70",
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
