import { BlockMetadata } from "@blockprotocol/core";
import {
  MenuItem,
  Select,
  Tab,
  Tabs,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { FunctionComponent } from "react";

type BlockVariantsTabsProps = {
  blockVariantsTab: number;
  metadata: BlockMetadata;
  setBlockVariantsTab: (newValue: number) => void;
};

export const BlockVariantsTabs: FunctionComponent<BlockVariantsTabsProps> = ({
  blockVariantsTab,
  metadata,
  setBlockVariantsTab,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  return isMobile ? (
    <Select
      sx={{ width: "100%", mb: 2 }}
      value={blockVariantsTab}
      onChange={(event) => setBlockVariantsTab(event.target.value as number)}
    >
      {metadata.variants ? (
        metadata.variants.map(
          (variant: { name: string }, variantIndex: number) => (
            <MenuItem key={variant.name} value={variantIndex}>
              {variant.name}
            </MenuItem>
          ),
        )
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
          color: "gray.70",
          transition: "0.25s all ease-in-out",
          padding: theme.spacing(1.5, 2),
          "&:hover": {
            backgroundColor: theme.palette.gray[10],
            borderTopLeftRadius: 6,
            borderTopRightRadius: 6,
            color: "gray.80",
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
      onChange={(_event: React.SyntheticEvent, newValue: number) =>
          setBlockVariantsTab(newValue)
        }
    >
      {metadata.variants ? (
        metadata.variants.map((variant: { name: string }) => (
          <Tab key={variant.name} label={variant.name} />
        ))
      ) : (
        <Tab label={metadata.displayName} />
      )}
    </Tabs>
  );
};
