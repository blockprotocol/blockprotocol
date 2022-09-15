import { Box } from "@mui/material";
import { FunctionComponent, ReactNode } from "react";

import styles from "./assets/debug-view-styles.module.css";
import { DebugView } from "./debug-view";
import { OffSwitch } from "./debug-view/icons";

export interface MockBlockDockUiProps {
  debugMode: boolean;
  onDebugModeChange: (debugMode: boolean) => void;
  children: ReactNode;
}

export const MockBlockDockUi: FunctionComponent<MockBlockDockUiProps> = ({
  debugMode,
  onDebugModeChange,
  children,
}) => {
  return debugMode ? (
    <DebugView>{children}</DebugView>
  ) : (
    <Box>
      <Box className={styles["mbd-debug-mode-toggle-header"]}>
        <button
          className={styles["mbd-debug-mode-toggle"]}
          type="button"
          onClick={() => onDebugModeChange(true)}
        >
          Preview Mode
          <OffSwitch />
        </button>
      </Box>
      {children}
    </Box>
  );
};
