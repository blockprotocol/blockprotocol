// @todo rename

import { Message } from "@blockprotocol/core/dist/esm/types";
import {
  KeyboardDoubleArrowDown,
  KeyboardDoubleArrowUp
} from "@mui/icons-material";
import {
  Box,
  IconButton,
  Paper,
  styled,
  Tab,
  Tabs,
  Typography
} from "@mui/material";
import {
  Dispatch,
  ReactNode,
  SetStateAction,
  useEffect,
  useRef,
  useState
} from "react";

import { DataStoreView } from "./bottom-view/datastore-view";
import { Log, LogsView } from "./bottom-view/logs-view";
import { PropertiesView } from "./bottom-view/properties";
import { SIDEBAR_WIDTH } from "./layout";

interface TabPanelProps {
  children?: ReactNode;
  index: number;
  value: number;
}

const TabPanel = (props: TabPanelProps) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
};

const a11yProps = (index: number) => {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`
  };
};

// @todo consider using context

const Container = styled(Paper)(({ theme }) => ({
  position: "fixed",
  height: 500,
  left: SIDEBAR_WIDTH,
  right: 0,
  bottom: 0,
  zIndex: 10,
  boxShadow: theme.shadows[4],
  transition: theme.transitions.create("height"),
  display: "flex",
  flexDirection: "column"
}));

// @todo: fix types
type BottomViewProps = {
  propsToInject: any;
  datastore: any;
  readonly: boolean;
  setReadonly: Dispatch<SetStateAction<boolean>>;
};

export const BottomView = ({
  propsToInject,
  datastore,
  setReadonly
}: BottomViewProps) => {
  const [value, setValue] = useState(0);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [logs, setLogs] = useState<Log[]>([]);
  const [minimized, setMinimized] = useState(false);

  useEffect(() => {
    const handler = (event: Event) => {
      const detail = (event as CustomEvent<Message>).detail;
      setLogs(prev => [
        ...prev,
        { ...detail, timestamp: new Date().toISOString() }
      ]);
    };

    // @todo store event name in constant or pull from CoreHandler
    window.addEventListener("blockprotocolmessage", handler);

    return () => {
      window.removeEventListener("blockprotocolmessage", handler);
    };
  }, []);

  return (
    <Container
      ref={containerRef}
      sx={{
        ...(minimized && { height: 50 })
      }}
    >
      <Box
        sx={{
          top: 0,
          zIndex: 5,
          display: "flex",
          justifyContent: "space-between",
          height: 50
        }}
      >
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
            setMinimized(prev => !prev);
          }}
        >
          {minimized ? <KeyboardDoubleArrowUp /> : <KeyboardDoubleArrowDown />}
        </IconButton>
      </Box>
      <Box
        sx={{
          flex: 1,
          overflowY: "scroll"
        }}
      >
        <TabPanel value={value} index={0}>
          <PropertiesView
            properties={propsToInject.graph}
            setReadonly={setReadonly}
          />
        </TabPanel>
        <TabPanel value={value} index={1}>
          <DataStoreView datastore={datastore} />
        </TabPanel>
        <TabPanel value={value} index={2}>
          <LogsView logs={logs} setLogs={setLogs} />
        </TabPanel>
      </Box>
    </Container>
  );
};
