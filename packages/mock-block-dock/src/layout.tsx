import { Close, DarkMode, LightMode, Logout } from "@mui/icons-material";
import {
  Box,
  Chip,
  createTheme,
  CssBaseline,
  Drawer,
  IconButton,
  styled,
  ThemeProvider,
  Tooltip,
  Typography,
} from "@mui/material";
import { ReactNode, useState } from "react";

type LayoutProps = {
  children: ReactNode;
  blockType?: "html" | "react" | "custom-element";
  exitDebugMode: () => void;
};

export const SIDEBAR_WIDTH = 200;

const HeaderContainer = styled(Box)(({ theme }) => ({
  height: 50,
  position: "sticky",
  top: 0,
  zIndex: 5,
  backgroundColor: theme.palette.background.default,
  display: "flex",
  alignItems: "center",
  paddingLeft: theme.spacing(3),
  paddingRight: theme.spacing(3),
  borderBottom: `1px solid ${theme.palette.divider}`,
}));

export const MainContainer = styled(Box)(() => ({
  display: "flex",
  flexDirection: "column",
  flex: 1,
  overflowY: "scroll",
  position: "relative",
  marginLeft: SIDEBAR_WIDTH,
}));

const chipInfo = {
  html: {
    color: "info",
    label: "HTML Block",
  },
  "custom-element": {
    label: "Custom Element Block",
    color: "warning",
  },
  react: { label: "React Block", color: "secondary" },
} as const;

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

const lightTheme = createTheme({
  palette: {
    mode: "light",
  },
});

export const Layout = ({ children, blockType, exitDebugMode }: LayoutProps) => {
  const [darkMode, setDarkMode] = useState(false);

  return (
    <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
      <CssBaseline />
      <Box height="100vh" display="flex">
        <Drawer
          variant="persistent"
          open
          PaperProps={{
            sx: {
              width: SIDEBAR_WIDTH,
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            },
          }}
        >
          <Typography variant="h6" mt={4} pl={2}>
            Mock Block Dock
          </Typography>
        </Drawer>
        <MainContainer component="main">
          <HeaderContainer>
            <Tooltip title={`Switch to ${darkMode ? "light" : "dark"} mode`}>
              <IconButton
                sx={{ mr: 1 }}
                onClick={() => setDarkMode((prev) => !prev)}
              >
                {darkMode ? <LightMode /> : <DarkMode />}
              </IconButton>
            </Tooltip>

            {blockType && (
              <Chip
                size="small"
                label={chipInfo[blockType].label}
                color={chipInfo[blockType].color}
              />
            )}

            {/* @todo add zoom functionality */}
            <Tooltip title="Exit Debug View">
              <IconButton onClick={exitDebugMode} sx={{ ml: "auto" }}>
                <Logout />
              </IconButton>
            </Tooltip>
          </HeaderContainer>
          <Box flex={1}>{children}</Box>
        </MainContainer>
      </Box>
    </ThemeProvider>
  );
};
