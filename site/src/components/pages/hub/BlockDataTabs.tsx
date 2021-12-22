import { VoidFunctionComponent } from "react";
import { Tabs, Tab } from "@mui/material";

import { disableTabAnimations } from "./HubUtils";

interface BlockDataTabsProps {
  blockDataTab: number;
  setBlockDataTab: (newValue: number) => void;
  modalOpen?: boolean;
}

export const BlockDataTabs: VoidFunctionComponent<BlockDataTabsProps> = ({
  blockDataTab,
  setBlockDataTab,
  modalOpen,
}) => {
  return (
    <Tabs
      disableRipple
      disableTouchRipple
      value={blockDataTab}
      onChange={(_event, newValue: number) => setBlockDataTab(newValue)}
      TabIndicatorProps={{
        style: { display: "none" },
      }}
      sx={{
        "& .MuiTab-root": {
          textTransform: "none",
          color: modalOpen ? "#64778C" : "#37434F",
          backgroundColor: modalOpen ? "#313D48" : "white",
          borderTopLeftRadius: 6,
          borderTopRightRadius: 6,
          border: "1px solid transparent",
          borderBottom: "0px",
          transition: "0.25s all ease-in-out",
          margin: 0,
          paddingLeft: "10px",
          paddingRight: "10px",
          ":hover": {
            backgroundColor: modalOpen ? "white" : undefined,
            color: modalOpen ? "black" : undefined,
            "&:not(.Mui-selected)": {
              border: !modalOpen ? "1px solid #e5e5e5" : undefined,
              borderBottom: "0px",
            },
          },
        },
        "& .MuiTab-root.Mui-selected": {
          backgroundColor: "#37434F",
          color: "white",
        },
      }}
    >
      <Tab {...disableTabAnimations} label="Data Source" />
      <Tab {...disableTabAnimations} label="Block Schema" />
    </Tabs>
  );
};
