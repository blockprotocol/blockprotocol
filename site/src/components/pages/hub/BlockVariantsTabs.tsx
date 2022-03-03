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

type BlockVariantsTabsProps = {
  blockVariantsTab: number;
  metadata: BlockMetadata;
  setBlockVariantsTab: (newValue: number) => void;
};

export const BlockVariantsTabs: VoidFunctionComponent<
  BlockVariantsTabsProps
> = ({ blockVariantsTab, metadata, setBlockVariantsTab }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  return isMobile ? (
    <Select
      sx={{ width: "100%", mb: 2 }}
      value={blockVariantsTab}
      onChange={(event) => setBlockVariantsTab(event.target.value as number)}
    >
      {metadata.variants ? (
        metadata.variants.map((variant, variantIndex) => (
          <MenuItem
            key={variant.name ?? variant.displayName}
            value={variantIndex}
          >
            {variant.name ?? variant.displayName}
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
          color: ({ palette }) => palette.gray[70],
          transition: "0.25s all ease-in-out",
          padding: theme.spacing(1.5, 2),
          "&:hover": {
            backgroundColor: theme.palette.gray[10],
            borderTopLeftRadius: 6,
            borderTopRightRadius: 6,
            color: ({ palette }) => palette.gray[80],
          },
          "&.Mui-selected": {
            backgroundColor: theme.palette.gray[10],
            color: theme.palette.purple[700],
            borderTopLeftRadius: 6,
            borderTopRightRadius: 6,
          },
        },
      }}
      value={blockVariantsTab}
      onChange={(_event, newValue: number) => setBlockVariantsTab(newValue)}
    >
      {metadata.variants ? (
        metadata.variants.map((variant) => (
          <Tab
            key={variant.name ?? variant.displayName}
            label={variant.name ?? variant.displayName}
          />
        ))
      ) : (
        <Tab label={metadata.displayName} />
      )}
    </Tabs>
  );
};
