import {
  MenuItem,
  Select,
  styled,
  Tab,
  Tabs,
  TabsProps,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { FunctionComponent } from "react";

const DesktopTabs = styled(
  ({ children, ...props }: TabsProps & { modalOpen?: boolean }) => (
    <Tabs
      TabIndicatorProps={{
        style: { display: "none" },
      }}
      {...props}
    >
      {children}
    </Tabs>
  ),
  {
    shouldForwardProp: (propName) => propName !== "modalOpen",
  },
)(({ theme, modalOpen }) => ({
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
}));

type BlockDataTabsProps = {
  blockDataTab: number;
  setBlockDataTab: (newValue: number) => void;
  modalOpen?: boolean;
  showExampleGraphTab?: boolean;
};

export const BlockDataTabs: FunctionComponent<BlockDataTabsProps> = ({
  blockDataTab,
  setBlockDataTab,
  modalOpen,
  showExampleGraphTab,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  return isMobile ? (
    <Select
      sx={{ width: "100%", mb: 2 }}
      value={blockDataTab}
      onChange={(event) => setBlockDataTab(event.target.value as number)}
    >
      <MenuItem value={0}>Block Properties</MenuItem>
      <MenuItem value={1}>Block Schema</MenuItem>
      {showExampleGraphTab && <MenuItem value={2}>Example Graph</MenuItem>}
    </Select>
  ) : (
    <DesktopTabs
      value={blockDataTab}
      onChange={(_event: React.SyntheticEvent, newValue: number) =>
        setBlockDataTab(newValue)
      }
      modalOpen={modalOpen}
    >
      <Tab label="Block Properties" />
      <Tab label="Block Schema" />
      {showExampleGraphTab && <Tab label="Mock Datastore" />}
    </DesktopTabs>
  );
};
