// @todo rename

import { Message } from "@blockprotocol/core/dist/esm/types";
import { Box, Button, Tab, Tabs, Typography } from "@mui/material";
import { ReactNode, useEffect, useLayoutEffect, useRef, useState } from "react";

import { Log, LogsView } from "./bottom-view/logs-view";
import { JsonView } from "./json-view";
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
    "aria-controls": `simple-tabpanel-${index}`,
  };
};

// @todo add resize functionality
// @todo consider using context

export const BottomView = ({
  propsToInject,
  datastore,
  readonly,
  setReadonly,
}) => {
  const [value, setValue] = useState(2);
  const containerRef = useRef<HTMLElement>();
  const [logs, setLogs] = useState<Log[]>([]);

  useEffect(() => {
    const handler = (event: Event) => {
      const detail = (event as CustomEvent<Message>).detail;
      setLogs((prev) => [
        ...prev,
        { ...detail, timestamp: new Date().toISOString() },
      ]);
    };

    // @todo store event name in constant or pull from CoreHandler
    window.addEventListener("blockprotocolmessage", handler);

    return () => {
      window.removeEventListener("blockprotocolmessage", handler);
    };
  }, []);

  return (
    <Box
      ref={containerRef}
      sx={{
        position: "fixed",
        height: 500,
        left: SIDEBAR_WIDTH,
        right: 0,
        bottom: 0,
        zIndex: 10,
        boxShadow: 4,
        backgroundColor: "white",
        overflowY: "scroll",
      }}
    >
      <Box
        sx={{
          position: "sticky",
          top: 0,
          zIndex: 5,
          backgroundColor: "white",
        }}
      >
        <Tabs value={value} onChange={(_, newVal) => setValue(newVal)}>
          <Tab
            disableRipple
            disableTouchRipple
            label="Block Properties"
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
      </Box>{" "}
      <TabPanel value={value} index={0}>
        {/* eslint-disable-next-line jsx-a11y/label-has-associated-control -- https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/issues/869  */}
        <label style={{ display: "block", marginBottom: 10 }}>
          <input
            type="checkbox"
            checked={readonly}
            onChange={(evt) => setReadonly(evt.target.checked)}
          />
          Read only mode
        </label>
        <Box height={20} />
        Block Properties
        <JsonView
          collapseKeys={["graph"]}
          rootName="props"
          src={propsToInject}
          onEdit={() => {
            return true;
          }}
          onAdd={() => {}}
        />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <JsonView
          collapseKeys={[
            "entities",
            "entityTypes",
            "links",
            "linkedAggregations",
          ]}
          rootName="datastore"
          src={{
            entities: datastore.entities,
            entityTypes: datastore.entityTypes,
            links: datastore.links,
            linkedAggregations: datastore.linkedAggregationDefinitions,
          }}
        />
      </TabPanel>
      <TabPanel value={value} index={2}>
        <LogsView logs={logs} setLogs={setLogs} />
      </TabPanel>
    </Box>
  );
};
