import {
  Box,
  Paper as MuiPaper,
  styled,
  Tab as MuiTab,
  tabClasses,
  TabProps,
  Tabs as MuiTabs,
  tabsClasses
} from "@mui/material";
import { forwardRef, useLayoutEffect, useRef, useState } from "react";
import { Resizable } from "react-resizable";
import useLocalStorageState from "use-local-storage-state";

import { DataStoreView } from "./dev-tools/datastore-view";
import { LogsView } from "./dev-tools/logs-view";
import { PropertiesView } from "./dev-tools/properties";
import { a11yProps, TabPanel } from "./dev-tools/tab-panel";

const Wrapper = styled(Box)(() => ({
  position: "fixed",
  left: 0,
  right: 0,
  bottom: 0,
  zIndex: 10000
}));

const TAB_HEIGHT = 40;

const Paper = styled(MuiPaper)(() => ({
  minHeight: TAB_HEIGHT + 2, // extra addition is to make tab indicator show
  display: "flex",
  flexDirection: "column"
}));

const Header = styled(Box)(({ theme }) => ({
  position: "sticky",
  top: 0,
  zIndex: 5,
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  borderBottom: `1px solid ${theme.palette.divider}`
}));

const Tabs = styled(MuiTabs)(({ theme }) => ({
  minHeight: TAB_HEIGHT,
  [`.${tabsClasses.indicator}`]: {
    backgroundColor: theme.palette.text.primary
  }
}));

const Tab = styled((props: TabProps) => (
  <MuiTab disableRipple disableTouchRipple {...props} />
))(({ theme }) => ({
  textTransform: "none",
  minHeight: TAB_HEIGHT,

  [`&.${tabClasses.selected}, .Mui-selected`]: {
    color: theme.palette.text.primary
  }
}));

const ResizeHandle = forwardRef<HTMLDivElement, any>((props, ref) => {
  const { handleAxis, ...restProps } = props;
  return (
    <Box
      ref={ref}
      className={`handle=${handleAxis}`}
      sx={theme => ({
        height: "1px",
        backgroundColor: theme.palette.divider,
        cursor: "ns-resize",
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 10
      })}
      {...restProps}
    />
  );
});

const getHandle = (handleAxis, ref) => (
  <ResizeHandle handleAxis={handleAxis} ref={ref} />
);

export const DevTools = () => {
  const [value, setValue] = useState(0);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const paperBoxRef = useRef<HTMLDivElement | null>(null);
  const [height, setHeight] = useLocalStorageState("mbd-dev-tools-height", {
    defaultValue: 350
  });
  const [width, setWidth] = useState<number>();

  useLayoutEffect(() => {
    if (!wrapperRef.current) return;
    setWidth(wrapperRef.current.getBoundingClientRect().width);
  }, []);

  return (
    <Wrapper ref={wrapperRef}>
      <Resizable
        height={height}
        width={width!}
        resizeHandles={["n"]}
        handle={getHandle}
        onResize={(_, { size }) => {
          setHeight(size.height);
        }}
      >
        <Paper sx={{ height }} ref={paperBoxRef}>
          <Header>
            <Tabs value={value} onChange={(_, newVal) => setValue(newVal)}>
              <Tab label="Properties" {...a11yProps(0)} />
              <Tab label="Datastore" {...a11yProps(1)} />
              <Tab label="Logs" {...a11yProps(2)} />
            </Tabs>
          </Header>
          <Box flex={1} overflow="scroll">
            <TabPanel value={value} index={0}>
              <PropertiesView />
            </TabPanel>
            <TabPanel value={value} index={1}>
              <DataStoreView />
            </TabPanel>
            <TabPanel value={value} index={2}>
              <LogsView />
            </TabPanel>
          </Box>
        </Paper>
      </Resizable>
    </Wrapper>
  );
};
