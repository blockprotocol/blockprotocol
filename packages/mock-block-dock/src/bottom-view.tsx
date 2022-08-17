// @todo rename

import { Box, Tab, Tabs, Typography } from "@mui/material";
import { ReactNode, useEffect, useRef, useState } from "react";

import { JsonView } from "./json-view";

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

export const BottomView = ({
  propsToInject,
  datastore,
  readonly,
  setReadonly,
}) => {
  const [value, setValue] = useState(2);
  const containerRef = useRef<HTMLElement>();
  const [logs, setLogs] = useState([]);
  const [activeLog, setActiveLog] = useState({});

  useEffect(() => {
    const handler = (stuff) => {
      console.log(stuff);
      setLogs((prev) => [
        ...prev,
        { ...stuff.detail, timeStamp: stuff.timeStamp },
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
        left: 250,
        right: 0,
        bottom: 0,
        zIndex: 10,
        boxShadow: 4,
        backgroundColor: "white",
        overflowY: "scroll",
      }}
    >
      <Box>
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
        <Box height={30} />
        Datastore
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
        <Box display="flex">
          <Box
            sx={{
              backgroundColor: "black",
              height: 400,
              overflowY: "auto",
              p: 3,
              flex: 1,
            }}
          >
            {logs.map((log) => (
              <Box
                key={log.requestId}
                color="white"
                mb={1}
                onClick={() => setActiveLog(log)}
                sx={{
                  cursor: "pointer",
                }}
              >
                {/* {log.timeStamp ? new Date(log.timeStamp).toISOString(): ""} ==> {log.messageName} => {JSON.stringify({
                    service: log.service,
                    messageName: log.messageName,
                    source: log.source
                })}
                <br/> */}
                <Box>
                  [{log.timeStamp ? new Date(log.timeStamp).toISOString() : ""}]
                  -{" "}
                  <Box
                    component="span"
                    sx={({ palette }) => ({
                      color:
                        log.service === "core"
                          ? palette.primary.main
                          : palette.secondary.main,
                    })}
                  >
                    [{log.service}]
                  </Box>{" "}
                  - [{log.source}] - {log.messageName} - [
                  {log.requestId.slice(0, 4)}]
                </Box>
              </Box>
            ))}
          </Box>
          <Box
            color="black"
            border="1px solid black"
            ml={3}
            width={400}
            display="flex"
            sx={{
              "& > div": {
                flex: 1,
                width: "100%",
                maxHeight: 400,
                overflowY: "scroll",
              },
            }}
          >
            <JsonView
              collapseKeys={[]}
              rootName={activeLog.requestId ?? "activeLog"}
              src={activeLog ?? {}}
            />
          </Box>
        </Box>

        {/* Logs */}
      </TabPanel>
    </Box>
  );
};
