import { StyledComponent } from "@emotion/styled";
import {
  Box,
  BoxProps,
  CssBaseline,
  styled,
  Theme,
  ThemeProvider,
} from "@mui/material";
import type { SystemProps } from "@mui/system";
import { ElementType, ReactNode, useState } from "react";

import { DevTools } from "./debug-view/dev-tools";
import { Header } from "./debug-view/header";
import { darkTheme, lightTheme } from "./debug-view/theme";

type DebugViewProps = {
  temporal: boolean;
  children: ReactNode;
};

export const MainContainer: StyledComponent<
  BoxProps<ElementType, SystemProps<Theme>>
> = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  flex: 1,
  overflowY: "scroll",
  position: "relative",
  backgroundColor: theme.palette.mode === "light" ? "#FBFCFD" : "#1E1E1E", // @todo include these in palette
}));

export const DebugView = ({ temporal, children }: DebugViewProps) => {
  const [darkMode, setDarkMode] = useState(false);

  return (
    <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
      <CssBaseline />
      <Box
        height="100vh"
        display="flex"
        flexDirection="column"
        justifyContent="space-between"
      >
        <Header
          temporal={temporal}
          darkMode={darkMode}
          setDarkMode={setDarkMode}
        />
        <Box flex={1} display="flex">
          <MainContainer component="main">
            <Box flex={1} padding={3.75}>
              {children}
            </Box>
            <DevTools temporal={temporal} />
          </MainContainer>
        </Box>
      </Box>
    </ThemeProvider>
  );
};
