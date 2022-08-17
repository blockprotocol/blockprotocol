import { Message } from "@blockprotocol/core/dist/esm/types";
import { Box, Button } from "@mui/material";
import { useEffect, useLayoutEffect, useRef, useState } from "react";

import { JsonView } from "../json-view";

type Log = Message & {
  timestamp: string;
};

export const LogsView = () => {
  const [logs, setLogs] = useState<Log[]>([]);
  const [activeLog, setActiveLog] = useState<Log>();
  const [scrolled, setScrolled] = useState(true);
  const logsContainerRef = useRef<HTMLElement>();

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

  useLayoutEffect(() => {
    if (!logsContainerRef.current) {
      return;
    }
    const { offsetHeight, scrollTop, scrollHeight } = logsContainerRef.current;

    if (scrollHeight === offsetHeight + scrollTop) {
      return;
    }

    if (scrolled && scrollHeight > offsetHeight + scrollTop && logs.length) {
      setScrolled(false);
    }
  }, [logs, scrolled]);

  return (
    <Box>
      <Box display="flex" mb={3}>
        <Box
          sx={{
            backgroundColor: "black",
            height: 350,
            overflowY: "auto",
            p: 3,
            flex: 1,
            position: "relative",
          }}
          ref={logsContainerRef}
        >
          <Box>
            {" "}
            {logs.map((log) => (
              <Box
                key={log.requestId}
                color="white"
                mb={0.5}
                sx={{
                  whitespace: "nowrap",
                }}
              >
                [{log.timestamp}] -{" "}
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
                - [{log.source}] - {log.messageName} -{" "}
                <Box
                  component="span"
                  onClick={() => setActiveLog(log)}
                  sx={{
                    textDecoration: "underline",
                    cursor: "pointer",
                  }}
                >
                  [{log.requestId.slice(0, 4)}]
                </Box>
              </Box>
            ))}
          </Box>

          <Box
            sx={{
              position: "absolute",
              color: "white",
              bottom: 8,
              right: 8,
              display: scrolled ? "none" : "block",
            }}
            onClick={() => {
              logsContainerRef.current?.scrollTo(
                0,
                logsContainerRef.current?.scrollHeight,
              );
              setScrolled(false);
            }}
          >
            Scroll to end
          </Box>
        </Box>
        <Box
          color="black"
          ml={3}
          width={500}
          display="flex"
          flexDirection="column"
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
            collapseKeys={["data"]}
            rootName={activeLog?.requestId ?? "activeLog"}
            src={activeLog ?? {}}
          />
        </Box>
      </Box>

      <Button onClick={() => setLogs([])} variant="contained">
        Clear Logs
      </Button>
    </Box>
  );
};
