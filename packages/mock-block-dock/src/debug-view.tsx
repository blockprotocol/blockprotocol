import {
  Box,
  CssBaseline,
  Drawer as MuiDrawer,
  drawerClasses,
  styled,
  ThemeProvider,
  Typography,
} from "@mui/material";
import { ReactNode, useState } from "react";

import { DevTools } from "./debug-view/dev-tools";
import { Header, HEADER_HEIGHT } from "./debug-view/header";
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
  // marginLeft: SIDEBAR_WIDTH,
}));

const Drawer = styled(MuiDrawer)(({ theme }) => ({
  [`.${drawerClasses.paper}`]: {
    width: SIDEBAR_WIDTH,
    display: "flex",
    flexDirection: "column",
    paddingTop: `${HEADER_HEIGHT}px`,
    backgroundColor:
      theme.palette.mode === "light" ? theme.palette.common.white : "#1E1E1E",
  },
}));

export const DebugView = ({ children }: DebugViewProps) => {
  const [darkMode, setDarkMode] = useState(false);

  return (
    <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
      <CssBaseline />
      <Box height="100vh" display="flex" flexDirection="column">
        <Header darkMode={darkMode} setDarkMode={setDarkMode} />
        <Box flex={1} display="flex">
          {/* <Drawer variant="persistent" open>
            <Typography variant="body1" mt={4} textAlign="center">
              Mock Block Dock
            </Typography>
            <Typography variant="subtitle2" textAlign="center">
              v{packageInfo.version}
            </Typography>
          </Drawer> */}
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
// background to main section
// version to header
//  maybe switch between bottom and side view for devtools
// where it says person
