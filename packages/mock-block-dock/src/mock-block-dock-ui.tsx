import { Box } from "@mui/material";
import { FunctionComponent, ReactNode } from "react";

import styles from "./assets/debug-view-styles.module.css";
import { DebugView } from "./debug-view";
import { OffSwitch } from "./debug-view/icons";
import { useMockBlockDockContext } from "./mock-block-dock-context";

export const MockBlockDockUi: FunctionComponent<{ children: ReactNode }> = ({
  children,
}) => {
  const { setDebugMode, debugMode } = useMockBlockDockContext();

  return debugMode ? (
    <DebugView>{children}</DebugView>
  ) : (
    <Box>
      <Box className={styles["mbd-debug-mode-toggle-header"]}>
        <button
          className={styles["mbd-debug-mode-toggle"]}
          type="button"
          onClick={() => setDebugMode(true)}
        >
          Preview Mode
          <OffSwitch />
        </button>
      </Box>
      {children}
    </Box>
  );
};
