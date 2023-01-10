import { Box } from "@mui/material";
import { FunctionComponent, ReactNode } from "react";

import { DebugView } from "./debug-view";
import { OnSwitch } from "./debug-view/icons";
import { useMockBlockDockContext } from "./mock-block-dock-context";

export const MockBlockDockUi: FunctionComponent<{ children: ReactNode }> = ({
  children,
}) => {
  const { setDebugMode, debugMode } = useMockBlockDockContext();

  const childrenWithBorder = (
    <div
      style={{
        border: debugMode ? "1px dashed rgb(0,0,0,0.1)" : "none",
        marginTop: 30,
      }}
    >
      {children}
    </div>
  );

  return debugMode ? (
    <DebugView>{childrenWithBorder}</DebugView>
  ) : (
    <Box>
      <div className="mbd-debug-mode-toggle-header">
        <button
          className="mbd-debug-mode-toggle"
          type="button"
          onClick={() => setDebugMode(true)}
        >
          Preview Mode
          <OnSwitch sx={{ height: "20px", width: "40px", ml: "10px" }} />
        </button>
      </div>
      {childrenWithBorder}
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
      <style jsx="true">
        {`
          .mbd-debug-mode-toggle-header {
            display: flex;
            justify-content: flex-end;
            align-items: center;
            padding-left: 24px;
            padding-right: 24px;
            border-bottom: 1px solid rgba(0, 0, 0, 0.12);
            height: 50px;
          }

          .mbd-debug-mode-toggle {
            font-family: Inter, "Helvetica", "Arial", sans-serif;
            z-index: 1000;
            border: 1px solid #dde7f0;
            color: #37434e;
            background: transparent;
            font-size: 0.8125rem;
            line-height: 1.75;
            padding: 3px 9px;
            border-radius: 4px;
            cursor: pointer;
            align-content: baseline;
            display: flex;
            align-items: center;
          }

          .mbd-debug-mode-toggle:hover {
            background-color: rgba(0, 0, 0, 0.04);
          }
        `}
      </style>
    </Box>
  );
};
