// @todo rename

import { Message } from "@blockprotocol/core/dist/esm/types";
import { BlockGraphProperties } from "@blockprotocol/graph";
import { Entity } from "@blockprotocol/graph/.";
import {
  KeyboardDoubleArrowDown,
  KeyboardDoubleArrowUp,
} from "@mui/icons-material";
import {
  Box,
  IconButton,
  Paper,
  PaperProps,
  styled,
  Tab,
  Tabs,
} from "@mui/material";
import { Dispatch, SetStateAction, useRef, useState } from "react";

import { DataStoreView } from "./bottom-view/datastore-view";
import { LogsView } from "./bottom-view/logs-view";
import { PropertiesView } from "./bottom-view/properties";
import { a11yProps, TabPanel } from "./bottom-view/tab-panel";
import { SIDEBAR_WIDTH } from "./debug-layout";
import { MockData } from "./use-mock-block-props/use-mock-datastore";

const Container = styled((props: PaperProps & { minimized: boolean }) => (
  <Paper {...props} />
))(({ theme, minimized }) => ({
  position: "fixed",
  height: minimized ? 50 : 500,
  left: SIDEBAR_WIDTH,
  right: 0,
  bottom: 0,
  zIndex: 10,
  boxShadow: theme.shadows[4],
  transition: theme.transitions.create("height"),
  display: "flex",
  flexDirection: "column",
}));

const Header = styled(Box)(({ theme }) => ({
  top: 0,
  zIndex: 5,
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  height: 50,
  borderBottom: `1px solid ${theme.palette.divider}`,
}));

type BottomViewProps = {
  graphProperties: BlockGraphProperties<any>;
  datastore: MockData;
  readonly: boolean;
  setReadonly: Dispatch<SetStateAction<boolean>>;
  setBlockEntity: (entity: Entity) => void;
};

export const DevTools = ({
  graphProperties,
  datastore,
  readonly,
  setReadonly,
  setBlockEntity,
}: BottomViewProps) => {
  const [value, setValue] = useState(0);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [minimized, setMinimized] = useState(false);

  return (
    <Container ref={containerRef} minimized={minimized}>
      <Header>
        <Tabs value={value} onChange={(_, newVal) => setValue(newVal)}>
          <Tab
            disableRipple
            disableTouchRipple
            label="Properties"
            {...a11yProps(0)}
          />
          <Tab
            disableRipple
            disableTouchRipple
            label="Datastore"
            {...a11yProps(1)}
          />
          <Tab
            disableRipple
            disableTouchRipple
            label="Logs"
            {...a11yProps(2)}
          />
        </Tabs>

        <IconButton
          onClick={() => {
            setMinimized((prev) => !prev);
          }}
        >
          {minimized ? <KeyboardDoubleArrowUp /> : <KeyboardDoubleArrowDown />}
        </IconButton>
      </Header>
      <Box flex={1} overflow="scroll">
        <TabPanel value={value} index={0}>
          <PropertiesView
            blockEntity={graphProperties.graph.blockEntity}
            // setBlockEntity={setBlockEntity}
          />
        </TabPanel>
        <TabPanel value={value} index={1}>
          <DataStoreView datastore={datastore} />
        </TabPanel>
        <TabPanel value={value} index={2}>
          <LogsView />
        </TabPanel>
      </Box>
    </Container>
  );
};
