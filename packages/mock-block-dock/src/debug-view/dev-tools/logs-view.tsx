import { Message } from "@blockprotocol/core";
import {
  Box,
  Button,
  MenuItem,
  Select,
  styled,
  Typography,
} from "@mui/material";
import { useEffect, useMemo, useRef, useState } from "react";

import { useMockBlockDockContext } from "../../mock-block-dock-context";
import { usePrevious } from "../../use-previous";
import { JsonView } from "./json-view";

export type Log = Message;

type LogItemProps = {
  onClick: (activeLog: Log) => void;
  log: Log;
  isActive: boolean;
};

const LogItem = ({ onClick, log, isActive }: LogItemProps) => {
  return (
    <Typography
      onClick={() => onClick(log)}
      variant="subtitle2"
      sx={{
        mb: 0.5,
        display: "subtitle1",
        whiteSpace: "nowrap",
        fontFamily: "Mono, monospace",
        cursor: "pointergit com",
      }}
    >
      [{log.timestamp}]
      <Box
        component="span"
        sx={({ palette }) => ({
          ml: 1.5,
          mr: 1,
          color:
            log.service === "core"
              ? palette.primary.main
              : palette.secondary.main,
        })}
      >
        [{log.service}]
      </Box>
      [{log.source}] - {log.messageName} -{" "}
      <Box
        component="span"
        sx={({ palette }) => ({
          textDecoration: "underline",
          cursor: "pointer",
          ...(isActive && { color: palette.primary.main }),
        })}
      >
        [{log.requestId.slice(0, 4)}]
      </Box>
    </Typography>
  );
};

const LogsContainer = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.background.default,
  border: `1px solid ${theme.palette.divider}`,
  height: 350,
  overflowY: "auto",
  padding: theme.spacing(3),
  flex: 1,
  position: "relative",
}));

const ActiveLogsContainer = styled(Box)(({ theme }) => ({
  marginLeft: theme.spacing(3),
  width: 500,
  display: "flex",
  flexDirection: "column",
  backgroundColor: theme.palette.background.default,
  border: `1px solid ${theme.palette.divider}`,

  "& > div": {
    flex: 1,
    width: "100%",
    maxHeight: 400,
    overflowY: "scroll",
  },
}));

export const LogsView = () => {
  const [activeLog, setActiveLog] = useState<Message>();
  const [filters, setFilters] = useState({
    source: "all",
    service: "all",
  });
  const logsContainerRef = useRef<HTMLElement>();
  const { logs, setLogs } = useMockBlockDockContext();
  const prevLogs = usePrevious(logs);

  const filteredLogs = useMemo(() => {
    return logs
      .filter((log) => {
        const hasSource =
          filters.source === "all" ? true : log.source === filters.source;
        const hasService =
          filters.service === "all" ? true : log.service === filters.service;

        return hasSource && hasService;
      })
      .sort((a, b) =>
        new Date(a.timestamp).getTime() > new Date(b.timestamp).getTime()
          ? 1
          : -1,
      );
  }, [logs, filters]);

  useEffect(() => {
    if (prevLogs?.length !== logs.length) {
      // scroll to end of container
      logsContainerRef.current?.scrollTo(
        0,
        logsContainerRef.current?.scrollHeight,
      );
    }
  }, [prevLogs, logs]);

  return (
    <Box>
      <Box mb={2}>
        <Typography mr={1}>Filters </Typography>
        <Box display="flex" alignItems="center">
          <Typography variant="body2" mr={1}>
            Service
          </Typography>
          <Select
            size="small"
            value={filters.service}
            sx={{ mr: 1 }}
            onChange={(evt) =>
              setFilters((prev) => ({ ...prev, service: evt.target.value }))
            }
          >
            <MenuItem value="all">---</MenuItem>
            {/* @todo this should be pulled from logs instead of manually set */}
            <MenuItem value="core">Core</MenuItem>
            <MenuItem value="graph">Graph</MenuItem>
          </Select>

          <Typography variant="body2" mr={1} ml={2}>
            Source
          </Typography>
          <Select
            size="small"
            value={filters.source}
            onChange={(evt) =>
              setFilters((prev) => ({ ...prev, source: evt.target.value }))
            }
          >
            <MenuItem value="all">---</MenuItem>
            <MenuItem value="embedder">Embedder</MenuItem>
            <MenuItem value="block">Block</MenuItem>
          </Select>
        </Box>
      </Box>

      <Box display="flex" mb={3}>
        <LogsContainer ref={logsContainerRef}>
          <Box>
            {filteredLogs.map((log) => (
              <LogItem
                key={`${log.requestId}_${log.source}`}
                log={log}
                onClick={setActiveLog}
                isActive={
                  log.requestId === activeLog?.requestId &&
                  log.source === activeLog.source
                }
              />
            ))}
          </Box>
        </LogsContainer>

        <ActiveLogsContainer>
          {activeLog ? (
            <JsonView
              collapseKeys={["data"]}
              rootName={activeLog?.requestId ?? "activeLog"}
              src={activeLog ?? {}}
            />
          ) : (
            <Typography
              variant="subtitle2"
              fontWeight="normal"
              component="em"
              p={3}
            >
              Select a request id to view the full details
            </Typography>
          )}
        </ActiveLogsContainer>
      </Box>

      {/* @todo make more visible by positioning absolutely to top of container  */}
      <Button size="small" onClick={() => setLogs([])} variant="contained">
        Clear Logs
      </Button>
    </Box>
  );
};
