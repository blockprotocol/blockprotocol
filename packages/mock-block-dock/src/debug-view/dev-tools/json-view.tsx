import { Box, useTheme } from "@mui/material";
import ReactJson, { ReactJsonViewProps } from "react-json-view";

type Props = {
  collapseKeys: string[];
  rootName: string;
} & ReactJsonViewProps;

export const JsonView = ({ collapseKeys, rootName, src, ...props }: Props) => {
  const theme = useTheme();
  return (
    <Box
      sx={({ palette }) => ({
        backgroundColor: palette.background.default,
        border: `1px solid ${palette.divider}`,
        width: "100%",
        "& .react-json-view": {
          padding: 2,

          "& .pretty-json-container": {
            fontFamily: "Mono, monospace !important",
          },

          ".validation-failure": {
            fontSize: 12,
            position: "absolute",
            bottom: 8,
            right: 8,
          },
        },
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
