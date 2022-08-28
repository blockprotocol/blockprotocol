import "./assets/debug-view-styles.css";

import { Box, CssBaseline, styled, ThemeProvider } from "@mui/material";
import { ReactNode, useState } from "react";

import { DevTools } from "./debug-view/dev-tools";
import { Header } from "./debug-view/header";
import { darkTheme, lightTheme } from "./debug-view/theme";

type DebugViewProps = {
  children: ReactNode;
};

export const SIDEBAR_WIDTH = 200;

export const MainContainer = styled(Box)(() => ({
  display: "flex",
  flexDirection: "column",
  flex: 1,
  overflowY: "scroll",
  position: "relative",
}));

export const DebugView = ({ children }: DebugViewProps) => {
  const [darkMode, setDarkMode] = useState(false);

  return (
    <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
      <CssBaseline />
      <Box height="100vh" display="flex" flexDirection="column">
        <Header darkMode={darkMode} setDarkMode={setDarkMode} />
        <Box flex={1} display="flex">
          <MainContainer component="main">
            <Box flex={1} padding={3.75}>
              {children}
            </Box>
            <DevTools />
          </MainContainer>
        </Box>
      </Box>
    </ThemeProvider>
  );
};
