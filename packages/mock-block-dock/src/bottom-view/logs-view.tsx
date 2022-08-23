import { Message } from "@blockprotocol/core/dist/esm/types";
import {
  Box,
  Button,
  MenuItem,
  Select,
  styled,
  Typography,
} from "@mui/material";
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";

import { JsonView } from "../json-view";
import { useMockBlockDockContext } from "../mock-block-dock-context";

export type Log = Message;

type LogItemProps = {
  onClick: (activeLog: Log) => void;
  log: Log;
  isActive: boolean;
};

const LogItem = ({ onClick, log, isActive }: LogItemProps) => {
  return (
    <Box
      sx={{
        mb: 0.5,
        display: "flex",
        whiteSpace: "nowrap",
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
        onClick={() => onClick(log)}
        sx={({ palette }) => ({
          textDecoration: "underline",
          cursor: "pointer",
          ...(isActive && { color: palette.primary.main }),
        })}
      >
        [{log.requestId.slice(0, 4)}]
      </Box>
    </Box>
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

const ScrollToEndBtn = styled(Box)(() => ({
  position: "absolute",
  bottom: 8,
  right: 8,
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
  const [scrolled, setScrolled] = useState(true);
  const logsContainerRef = useRef<HTMLElement>();
  const { logs, setLogs } = useMockBlockDockContext();

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
    if (!logsContainerRef.current) return;

    const logsContainer = logsContainerRef.current;

    const handler = () => {
      const { offsetHeight, scrollTop, scrollHeight } = logsContainer;
      if (scrollHeight === offsetHeight + scrollTop) {
        setScrolled(true);
      }
      if (scrollHeight > offsetHeight + scrollTop) {
        setScrolled(false);
      }
    };

    logsContainer.addEventListener("scroll", handler);

    return () => {
      logsContainer.removeEventListener("scroll", handler);
    };
  }, []);

  useLayoutEffect(() => {
    if (!logsContainerRef.current) {
      return;
    }
    const { offsetHeight, scrollTop, scrollHeight } = logsContainerRef.current;

    if (!scrolled && scrollHeight === offsetHeight + scrollTop) {
      setScrolled(true);
    }

    if (scrolled && scrollHeight > offsetHeight + scrollTop) {
      setScrolled(false);
    }
  }, [scrolled]);

  const scrollToLogContainerEnd = () => {
    logsContainerRef.current?.scrollTo(
      0,
      logsContainerRef.current?.scrollHeight,
    );
    setScrolled(false);
  };

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

          <ScrollToEndBtn
            display={scrolled ? "none" : "block"}
            onClick={scrollToLogContainerEnd}
          >
            Scroll to end
          </ScrollToEndBtn>
        </LogsContainer>

        <ActiveLogsContainer>
          {activeLog ? (
            <JsonView
              collapseKeys={["data"]}
              rootName={activeLog?.requestId ?? "activeLog"}
              src={activeLog ?? {}}
            />
          ) : (
            <Typography component="em" p={3}>
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
