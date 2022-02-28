import { VoidFunctionComponent } from "react";
import {
  Tabs,
  Tab,
  useMediaQuery,
  useTheme,
  Select,
  MenuItem,
} from "@mui/material";

type BlockDataTabsProps = {
  blockDataTab: number;
  setBlockDataTab: (newValue: number) => void;
  modalOpen?: boolean;
};

export const BlockDataTabs: VoidFunctionComponent<BlockDataTabsProps> = ({
  blockDataTab,
  setBlockDataTab,
  modalOpen,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  return isMobile ? (
    <Select
      sx={{ width: "100%", mb: 2 }}
      value={blockDataTab}
      onChange={(event) => setBlockDataTab(event.target.value as number)}
    >
      <MenuItem value={0}>Data Source</MenuItem>
      <MenuItem value={1}>Block Schema</MenuItem>
    </Select>
  ) : (
    <Tabs
      value={blockDataTab}
      onChange={(_event, newValue: number) => setBlockDataTab(newValue)}
      TabIndicatorProps={{
        style: { display: "none" },
      }}
      sx={{
        "& .MuiTab-root": {
          textTransform: "none",
          color: theme.palette.gray[modalOpen ? 60 : 80],
          backgroundColor: modalOpen ? "#313D48" : theme.palette.common.white,
          borderTopLeftRadius: 6,
          borderTopRightRadius: 6,
          border: "1px solid transparent",
          borderBottom: "0px",
          transition: "0.25s all ease-in-out",
          margin: 0,
          padding: theme.spacing(1.5, 2),
          ":hover": {
            backgroundColor: modalOpen ? theme.palette.common.white : undefined,
            color: modalOpen ? "black" : undefined,
            "&:not(.Mui-selected)": {
              border: !modalOpen ? "1px solid #e5e5e5" : undefined,
              borderBottom: "0px",
            },
          },
        },
        "& .MuiTab-root.Mui-selected": {
          backgroundColor: theme.palette.gray[90],
          color: theme.palette.common.white,
        },
      }}
    >
      <Tab label="Data Source" />
      <Tab label="Block Schema" />
    </Tabs>
  );
};
