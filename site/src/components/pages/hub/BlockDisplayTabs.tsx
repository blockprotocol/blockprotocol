import {
  Tabs,
  Tab,
  useTheme,
  MenuItem,
  Select,
  useMediaQuery,
} from "@mui/material";
import { BlockMetadata } from "blockprotocol";
import { VoidFunctionComponent } from "react";

type BlockDisplayTabsProps = {
  blockTab: number;
  metadata: BlockMetadata;
  setBlockTab: (newValue: number) => void;
};

export const BlockDisplayTabs: VoidFunctionComponent<BlockDisplayTabsProps> = ({
  blockTab,
  metadata,
  setBlockTab,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  return isMobile ? (
    <Select
      sx={{ width: "100%", mb: 2 }}
      value={blockTab}
      onChange={(event) => setBlockTab(event.target.value as number)}
    >
      {metadata.variants ? (
        metadata.variants.map((variant, variantIndex) => (
          <MenuItem key={variant.displayName} value={variantIndex}>
            {variant.displayName}
          </MenuItem>
        ))
      ) : (
        <MenuItem value={0}>{metadata.displayName}</MenuItem>
      )}
    </Select>
  ) : (
    <Tabs
      TabIndicatorProps={{
        style: { display: "none" },
      }}
      sx={{
        overflowX: "auto",
        "& .MuiTab-root": {
          textTransform: "none",
          margin: 0,
          color: ({ palette }) => palette.gray[60],
          transition: "0.25s all ease-in-out",
          paddingLeft: "10px",
          paddingRight: "10px",
          "&:hover": {
            backgroundColor: theme.palette.gray[10],
            borderTopLeftRadius: 6,
            borderTopRightRadius: 6,
            color: ({ palette }) => palette.gray[70],
          },
          "&.Mui-selected": {
            backgroundColor: theme.palette.gray[10],
            color: theme.palette.purple[700],
            borderTopLeftRadius: 6,
            borderTopRightRadius: 6,
          },
        },
      }}
      value={blockTab}
      onChange={(_event, newValue: number) => setBlockTab(newValue)}
    >
      {metadata.variants ? (
        metadata.variants.map((variant) => (
          <Tab key={variant.displayName} label={variant.displayName} />
        ))
      ) : (
        <Tab label={metadata.displayName} />
      )}
    </Tabs>
  );
};
