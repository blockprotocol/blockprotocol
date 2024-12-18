import {
  alpha,
  Box,
  Paper as MuiPaper,
  styled,
  Tab as MuiTab,
  tabClasses,
  TabProps,
  Tabs as MuiTabs,
  tabsClasses,
} from "@mui/material";
import { forwardRef, useLayoutEffect, useRef, useState } from "react";
import { Resizable } from "react-resizable";
import useLocalStorageState from "use-local-storage-state";

import { BlockInfoView } from "./dev-tools/block-info-view";
import { DataStoreView } from "./dev-tools/datastore-view";
import { LogsView } from "./dev-tools/logs-view";
import { PropertiesView } from "./dev-tools/properties";
import { a11yProps, TabPanel } from "./dev-tools/tab-panel";
import { HEADER_HEIGHT } from "./header";

const TAB_HEIGHT = 40;

const Paper = styled(MuiPaper)(() => ({
  minHeight: TAB_HEIGHT + 2, // extra addition is to make tab indicator show
  maxHeight: `calc(100vh - ${HEADER_HEIGHT}px)`,
  display: "flex",
  flexDirection: "column",
}));

const Header = styled(Box)(({ theme }) => ({
  position: "sticky",
  top: 0,
  zIndex: 5,
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  borderBottom: `1px solid ${alpha(theme.palette.divider, 0.05)}`,
  paddingRight: 32,
}));

const Tabs = styled(MuiTabs)(({ theme }) => ({
  minHeight: TAB_HEIGHT,
  [`.${tabsClasses.indicator}`]: {
    backgroundColor: theme.palette.text.primary,
  },
}));

const Tab = styled((props: TabProps) => (
  <MuiTab disableRipple disableTouchRipple {...props} />
))(({ theme }) => ({
  textTransform: "none",
  minHeight: TAB_HEIGHT,

  [`&.${tabClasses.selected}, .Mui-selected`]: {
    color: theme.palette.text.primary,
  },
}));

const ResizeHandle = forwardRef<HTMLDivElement, any>((props, ref) => {
  const { handleAxis, ...restProps } = props;
  return (
    <Box
      ref={ref}
      className={`handle=${handleAxis}`}
      sx={(theme) => ({
        borderBottom: `1px solid ${theme.palette.divider}`,
        cursor: "ns-resize",
        position: "absolute",
        // extend the resize handle 10px above its visible border to make it an easier click target
        top: "-10px",
        paddingBottom: "10px",
        left: 0,
        right: 0,
        zIndex: 10,
      })}
      {...restProps}
    />
  );
});

export const DevTools = ({ temporal }: { temporal: boolean }) => {
  const [selectedTabIndex, setSelectedTabIndex] = useLocalStorageState(
    "debug-tab-index",
    { defaultValue: 0 },
  );
  const wrapperRef = useRef<HTMLDivElement>(null);
  const paperBoxRef = useRef<HTMLDivElement | null>(null);
  const [height, setHeight] = useLocalStorageState("mbd-dev-tools-height", {
    defaultValue: 350,
  });
  const [width, setWidth] = useState<number>();

  useLayoutEffect(() => {
    if (!wrapperRef.current) {
      return;
    }
    setWidth(wrapperRef.current.getBoundingClientRect().width);
  }, []);

  return (
    <Box ref={wrapperRef} height={height} position="relative">
      {/* @ts-expect-error -- React 19 typing issue from resizable library? */}
      <Resizable
        height={height}
        width={width ?? 0}
        resizeHandles={["n"]}
        handle={<ResizeHandle />}
        onResize={(_, { size }) => {
          setHeight(size.height);
        }}
      >
        <Paper sx={{ height }} ref={paperBoxRef}>
          <Header>
            <Tabs
              value={selectedTabIndex}
              onChange={(_, newVal) => setSelectedTabIndex(newVal)}
            >
              <Tab label="Properties" {...a11yProps(0)} sx={{ pl: 3 }} />
              <Tab label="Datastore" {...a11yProps(1)} />
              <Tab label="Logs" {...a11yProps(2)} />
              <Tab label="Block Info" {...a11yProps(3)} />
            </Tabs>
          </Header>
          <Box flex={1} overflow="scroll">
            <TabPanel value={selectedTabIndex} index={0}>
              <PropertiesView temporal={temporal} />
            </TabPanel>
            <TabPanel value={selectedTabIndex} index={1}>
              <DataStoreView temporal={temporal} />
            </TabPanel>
            <TabPanel value={selectedTabIndex} index={2}>
              <LogsView temporal={temporal} />
            </TabPanel>
            <TabPanel value={selectedTabIndex} index={3}>
              <BlockInfoView temporal={temporal} />
            </TabPanel>
          </Box>
        </Paper>
      </Resizable>
      <style jsx="true" global="true">{`
        @font-face {
          font-family: "Inter";
          font-weight: 300;
          src: url("https://cdn-us1.hash.ai/assets/fonts/Inter-Italic.woff2")
            format("woff2");
        }

        @font-face {
          font-family: "Inter";
          font-weight: 400;
          src: url("https://cdn-us1.hash.ai/assets/fonts/Inter-Regular.woff2")
            format("woff2");
        }

        @font-face {
          font-family: "Inter";
          font-weight: 500;
          src: url("https://cdn-us1.hash.ai/assets/fonts/Inter-Medium.woff2")
            format("woff2");
        }

        @font-face {
          font-family: "Mono";
          font-weight: 400;
          src: url("https://cdn-us1.hash.ai/assets/fonts/jet-brains-mono-regular.woff2")
            format("woff2");
        }

        body {
          margin: 0;
        }
      `}</style>
    </Box>
  );
};
