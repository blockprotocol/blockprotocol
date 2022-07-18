/* eslint-disable-next-line -- allow import of original popover to extend it */
import { Popover as MuiPopover, PopoverProps } from "@mui/material";
import { useScrollLock } from "../util/mui-utils";

/**
 * Custom Popover re-implementing MUI's troublesome scroll-lock mechanism.
 */
export const Popover: React.FunctionComponent<PopoverProps> = ({
  disableScrollLock = false,
  ...props
}) => {
  useScrollLock(!disableScrollLock && props.open);
  return <MuiPopover disableScrollLock {...props} />;
};
