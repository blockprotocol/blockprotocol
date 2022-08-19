import { Box, useTheme } from "@mui/material";
import ReactJson from "react-json-view";

export const JsonView = ({
  collapseKeys,
  rootName,
  src,
  ...props
}: {
  collapseKeys: string[];
  rootName: string;
  src: Record<string, unknown> | object;
}) => {
  const theme = useTheme();
  return (
    <Box
      sx={({ palette }) => ({
        backgroundColor: palette.background.default,
        padding: 2,
        border: `1px solid ${palette.divider}`,
        width: "100%",
      })}
    >
      <ReactJson
        shouldCollapse={({ name }) => !!name && collapseKeys.includes(name)}
        name={rootName}
        src={src}
        theme={theme.palette.mode === "light" ? "rjv-default" : "colors"}
        {...props}
      />
    </Box>
  );
};
