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
        padding: 2,
        border: `1px solid ${palette.divider}`,
        width: "100%",

        "& .react-json-view": {
          fontFamily: "Mono !important"
        }
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
