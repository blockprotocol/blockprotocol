/* eslint-disable-next-line -- allow import of original popover to extend it */
import { Popover as MuiPopover, PopoverProps } from "@mui/material";
import React, { useLayoutEffect } from "react";

/**
 * Simple wrapper for MUI's Propover re-implementing its troublesome scroll-lock
 * mechanism. MUI applies a padding to the body to replace the scrollbar which
 * may break the layout. This version applies different yet equally effective
 * styles to the document element.
 */
export const Popover: React.FC<PopoverProps> = ({
  disableScrollLock = false,
  ...props
}) => {
  const applyScrollLock = !disableScrollLock && props.open;

  useLayoutEffect(() => {
    document.documentElement.style.cssText = applyScrollLock
      ? "position: fixed; overflow-y: scroll; width: 100%"
      : "";
  }, [applyScrollLock]);

  return <MuiPopover disableScrollLock {...props} />;
};
