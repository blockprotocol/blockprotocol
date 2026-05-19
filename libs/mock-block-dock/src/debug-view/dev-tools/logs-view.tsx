import { Message } from "@blockprotocol/core";
import {
  Box,
  Button,
  MenuItem,
  Select,
  styled,
  SxProps,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Theme,
  Typography,
} from "@mui/material";
import {
  Dispatch,
  ReactNode,
  SetStateAction,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  useMockBlockDockNonTemporalContext,
  useMockBlockDockTemporalContext,
} from "../../mock-block-dock-context";
import { usePrevious } from "../../use-previous";
import { JsonView } from "./json-view";

export type Log = Message;

type LogItemProps = {
  onClick: (activeLog: Log) => void;
  log: Log;
  isActive: boolean;
};

const Cell = ({
  children,
  sx = [],
}: {
  children: ReactNode;
  sx?: SxProps<Theme>;
}) => (
  <TableCell
    sx={[
      {
        fontFamily: "Mono, monospace",
        border: "none",
        paddingBottom: 1.5,
        paddingTop: 0,
        paddingRight: 2,
        paddingLeft: 0,
      },
      ...(Array.isArray(sx) ? sx : [sx]),
    ]}
  >
    {children}
  </TableCell>
);

const LogItem = ({ onClick, log, isActive }: LogItemProps) => {
  return (
    <TableRow
      onClick={() => onClick(log)}
      sx={{
        whiteSpace: "nowrap",
        cursor: "pointer",
        userSelect: "none",
      }}
    >
      <Cell>[{log.timestamp}]</Cell>
      <Cell
        sx={({ palette }) => ({
          color:
            log.module === "core"
              ? palette.primary.main
              : palette.secondary.main,
        })}
      >
        [{log.module}]
      </Cell>
      <Cell>[{log.source}]</Cell>
      <Cell>[{log.messageName}]</Cell>
      <Cell
        sx={({ palette }) => ({
          textDecoration: "underline",
          ...(isActive && { color: palette.primary.main }),
        })}
      >
        [{log.requestId.slice(0, 4)}]
      </Cell>
    </TableRow>
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

const LogsViewComponent = ({
  logs,
  setLogs,
}: {
  logs: Message[];
  setLogs: Dispatch<SetStateAction<Message[]>>;
}) => {
  const [activeLog, setActiveLog] = useState<Message>();
  const [filters, setFilters] = useState({
    source: "all",
    module: "all",
  });
  const logsContainerRef = useRef<HTMLElement | null>(null);
  const prevLogs = usePrevious(logs);

  const filteredLogs = useMemo(() => {
    return logs
      .filter((log) => {
        const hasSource =
          filters.source === "all" ? true : log.source === filters.source;
        const hasModule =
          filters.module === "all" ? true : log.module === filters.module;

        return hasSource && hasModule;
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
      <Box display="flex" alignItems="center" mb={2}>
        <Typography variant="body2" mr={1}>
          Module
        </Typography>
        <Select
          size="small"
          value={filters.module}
          sx={{ mr: 1 }}
          onChange={(evt) =>
            setFilters((prev) => ({ ...prev, module: evt.target.value }))
          }
        >
          <MenuItem value="all">All</MenuItem>
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
          sx={{ mr: 6 }}
        >
          <MenuItem value="all">All</MenuItem>
          <MenuItem value="embedder">Embedder</MenuItem>
          <MenuItem value="block">Block</MenuItem>
        </Select>
        <Button size="small" onClick={() => setLogs([])} variant="contained">
          Clear Logs
        </Button>
      </Box>

      <Box display="flex" mb={3}>
        <LogsContainer ref={logsContainerRef}>
          <Table>
            <TableHead>
              <TableRow>
                <Cell>timestamp</Cell>
                <Cell>module</Cell>
                <Cell>source</Cell>
                <Cell>name</Cell>
                <Cell>id</Cell>
              </TableRow>
            </TableHead>
            <TableBody>
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
            </TableBody>
          </Table>
        </LogsContainer>

        <ActiveLogsContainer>
          {activeLog ? (
            <JsonView
              collapseKeys={["data"]}
              rootName={activeLog?.requestId ?? "activeLog"}
              src={activeLog}
            />
          ) : (
            <Typography
              variant="subtitle2"
              fontWeight="normal"
              component="em"
              textAlign="center"
              p={3}
            >
              Select a request id to view the full details
            </Typography>
          )}
        </ActiveLogsContainer>
      </Box>
    </Box>
  );
};

const LogsViewNonTemporal = () => {
  const { logs, setLogs } = useMockBlockDockNonTemporalContext();
  return <LogsViewComponent logs={logs} setLogs={setLogs} />;
};

const LogsViewTemporal = () => {
  const { logs, setLogs } = useMockBlockDockTemporalContext();
  return <LogsViewComponent logs={logs} setLogs={setLogs} />;
};

export const LogsView = ({ temporal }: { temporal: boolean }) =>
  temporal ? <LogsViewTemporal /> : <LogsViewNonTemporal />;
